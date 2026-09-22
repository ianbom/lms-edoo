import {
    Captions,
    FastForward,
    LoaderCircle,
    Maximize,
    Minimize,
    Pause,
    Play,
    Rewind,
    RotateCcw,
    Settings,
    Volume1,
    Volume2,
    VolumeX,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { cn } from '@/lib/utils';

type VideoPlayerProps = {
    videoId: string;
    title: string;
};

type PlayerStatus = 'loading' | 'ready' | 'error';
type SeekFeedback = {
    direction: 'backward' | 'forward';
    seconds: number;
} | null;

type YouTubePlayer = {
    destroy: () => void;
    getCurrentTime: () => number;
    getDuration: () => number;
    getAvailablePlaybackRates: () => number[];
    getOption: (module: string, option: string) => unknown;
    getOptions: (module?: string) => string[];
    getIframe: () => HTMLIFrameElement;
    getPlaybackRate: () => number;
    getVideoLoadedFraction: () => number;
    getVolume: () => number;
    isMuted: () => boolean;
    mute: () => void;
    pauseVideo: () => void;
    playVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    setPlaybackRate: (rate: number) => void;
    setOption: (module: string, option: string, value: number) => void;
    setVolume: (volume: number) => void;
    unMute: () => void;
};

type YouTubePlayerEvent = { target: YouTubePlayer };
type YouTubeStateEvent = YouTubePlayerEvent & { data: number };
type YouTubeErrorEvent = YouTubePlayerEvent & { data: number };
type YouTubePlaybackRateEvent = YouTubePlayerEvent & { data: number };

type YouTubePlayerOptions = {
    videoId: string;
    host?: string;
    playerVars: Record<string, number | string>;
    events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onApiChange: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubeStateEvent) => void;
        onPlaybackRateChange: (event: YouTubePlaybackRateEvent) => void;
        onError: (event: YouTubeErrorEvent) => void;
    };
};

type YouTubeNamespace = {
    Player: new (
        element: HTMLElement,
        options: YouTubePlayerOptions,
    ) => YouTubePlayer;
};

declare global {
    interface Window {
        YT?: YouTubeNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

const YOUTUBE_STATE = {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
} as const;

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
const CONTROLS_HIDE_DELAY = 2800;
const CLICK_DELAY = 220;
const SEEK_FEEDBACK_DURATION = 650;

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi(): Promise<YouTubeNamespace> {
    if (window.YT?.Player) {
        return Promise.resolve(window.YT);
    }

    if (youtubeApiPromise) {
        return youtubeApiPromise;
    }

    youtubeApiPromise = new Promise<YouTubeNamespace>((resolve, reject) => {
        let timeoutId: number | null = null;
        let settled = false;

        const finish = (): void => {
            if (settled || !window.YT?.Player) {
                return;
            }

            settled = true;
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            resolve(window.YT);
        };

        const fail = (): void => {
            if (settled) {
                return;
            }

            settled = true;
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            reject(new Error('YouTube IFrame API gagal dimuat.'));
        };

        const previousReadyHandler = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previousReadyHandler?.();
            finish();
        };

        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src="https://www.youtube.com/iframe_api"]',
        );

        if (existingScript) {
            existingScript.addEventListener('error', fail, { once: true });
        } else {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            script.addEventListener('error', fail, { once: true });
            document.head.appendChild(script);
        }

        timeoutId = window.setTimeout(fail, 15000);
        finish();
    }).catch((error: unknown) => {
        youtubeApiPromise = null;
        throw error;
    });

    return youtubeApiPromise;
}

function extractYouTubeVideoId(value: string): string | null {
    const input = value.trim();
    const validId = /^[a-zA-Z0-9_-]{6,20}$/;

    if (validId.test(input)) {
        return input;
    }

    try {
        const url = new URL(
            /^https?:\/\//i.test(input) ? input : `https://${input}`,
        );
        const host = url.hostname.toLowerCase().replace(/^www\./, '');
        let candidate: string | null = null;

        if (host === 'youtu.be') {
            candidate = url.pathname.split('/').filter(Boolean)[0] ?? null;
        } else if (
            host === 'youtube.com' ||
            host === 'm.youtube.com' ||
            host === 'youtube-nocookie.com'
        ) {
            if (url.pathname === '/watch') {
                candidate = url.searchParams.get('v');
            } else {
                const segments = url.pathname.split('/').filter(Boolean);
                if (['embed', 'shorts', 'live'].includes(segments[0] ?? '')) {
                    candidate = segments[1] ?? null;
                }
            }
        }

        return candidate && validId.test(candidate) ? candidate : null;
    } catch {
        return null;
    }
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '00:00';
    }

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainder = totalSeconds % 60;

    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return Boolean(
        target.closest(
            'input, textarea, select, button, [contenteditable="true"]',
        ),
    );
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    const resolvedVideoId = useMemo(
        () => extractYouTubeVideoId(videoId),
        [videoId],
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const playerMountRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const controlsTimerRef = useRef<number | null>(null);
    const progressFrameRef = useRef<number | null>(null);
    const clickTimerRef = useRef<number | null>(null);
    const feedbackTimerRef = useRef<number | null>(null);
    const rateMenuRef = useRef<HTMLDivElement>(null);
    const isSeekingRef = useRef(false);
    const lastVolumeRef = useRef(100);

    const [status, setStatus] = useState<PlayerStatus>(
        resolvedVideoId ? 'loading' : 'error',
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isVolumeInteracting, setIsVolumeInteracting] = useState(false);
    const [controlsHovered, setControlsHovered] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [rateMenuOpen, setRateMenuOpen] = useState(false);
    const [volume, setVolumeState] = useState(100);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loadedFraction, setLoadedFraction] = useState(0);
    const [playbackRate, setPlaybackRateState] = useState(1);
    const [availablePlaybackRates, setAvailablePlaybackRates] = useState<
        number[]
    >([...PLAYBACK_RATES]);
    const [captionsAvailable, setCaptionsAvailable] = useState(false);
    const [captionFontSize, setCaptionFontSize] = useState(0);
    const [seekFeedback, setSeekFeedback] = useState<SeekFeedback>(null);

    const clearControlsTimer = useCallback(() => {
        if (controlsTimerRef.current !== null) {
            window.clearTimeout(controlsTimerRef.current);
            controlsTimerRef.current = null;
        }
    }, []);

    const controlsPinned =
        !isPlaying ||
        isBuffering ||
        isEnded ||
        isSeeking ||
        isVolumeInteracting ||
        controlsHovered ||
        rateMenuOpen;

    const revealControls = useCallback(() => {
        setShowControls(true);
        clearControlsTimer();

        if (!controlsPinned) {
            controlsTimerRef.current = window.setTimeout(() => {
                setShowControls(false);
            }, CONTROLS_HIDE_DELAY);
        }
    }, [clearControlsTimer, controlsPinned]);

    const syncPlayerMetrics = useCallback(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        const nextDuration = player.getDuration();
        const nextCurrentTime = player.getCurrentTime();
        const nextLoadedFraction = player.getVideoLoadedFraction();

        if (!isSeekingRef.current && Number.isFinite(nextCurrentTime)) {
            setCurrentTime(nextCurrentTime);
        }
        if (Number.isFinite(nextDuration) && nextDuration > 0) {
            setDuration(nextDuration);
        }
        if (Number.isFinite(nextLoadedFraction)) {
            setLoadedFraction(Math.min(1, Math.max(0, nextLoadedFraction)));
        }
    }, []);

    useEffect(() => {
        const mount = playerMountRef.current;
        if (!mount || !resolvedVideoId) {
            setStatus('error');
            return;
        }

        let cancelled = false;
        let player: YouTubePlayer | null = null;
        const host = document.createElement('div');
        host.className = 'size-full';
        mount.replaceChildren(host);
        setStatus('loading');
        setIsPlaying(false);
        setIsBuffering(false);
        setIsEnded(false);
        setCurrentTime(0);
        setDuration(0);
        setLoadedFraction(0);
        setAvailablePlaybackRates([...PLAYBACK_RATES]);
        setCaptionsAvailable(false);
        setCaptionFontSize(0);

        loadYouTubeApi()
            .then((youtube) => {
                if (cancelled) {
                    return;
                }

                player = new youtube.Player(host, {
                    videoId: resolvedVideoId,
                    host: 'https://www.youtube-nocookie.com',
                    playerVars: {
                        controls: 0,
                        cc_lang_pref: 'id',
                        cc_load_policy: 1,
                        disablekb: 1,
                        enablejsapi: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        playsinline: 1,
                        rel: 0,
                        origin: window.location.origin,
                    },
                    events: {
                        onReady: (event) => {
                            if (cancelled) {
                                return;
                            }

                            playerRef.current = event.target;
                            const iframe = event.target.getIframe();
                            iframe.title = title;
                            iframe.referrerPolicy =
                                'strict-origin-when-cross-origin';
                            iframe.allow =
                                'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                            const nextVolume = event.target.getVolume();
                            setVolumeState(nextVolume);
                            lastVolumeRef.current = nextVolume || 100;
                            setIsMuted(event.target.isMuted());
                            setPlaybackRateState(
                                event.target.getPlaybackRate() || 1,
                            );
                            const playbackRates =
                                event.target.getAvailablePlaybackRates();
                            if (playbackRates.length > 0) {
                                setAvailablePlaybackRates(playbackRates);
                            }
                            setStatus('ready');
                            syncPlayerMetrics();
                        },
                        onApiChange: (event) => {
                            if (cancelled) {
                                return;
                            }

                            const captionOptions =
                                event.target.getOptions('captions');
                            const hasFontSize =
                                captionOptions.includes('fontSize');
                            setCaptionsAvailable(hasFontSize);

                            if (hasFontSize) {
                                const fontSize = event.target.getOption(
                                    'captions',
                                    'fontSize',
                                );
                                if (typeof fontSize === 'number') {
                                    setCaptionFontSize(fontSize);
                                }
                            }
                        },
                        onStateChange: (event) => {
                            if (cancelled) {
                                return;
                            }

                            const state = event.data;
                            setIsPlaying(state === YOUTUBE_STATE.PLAYING);
                            setIsBuffering(state === YOUTUBE_STATE.BUFFERING);
                            setIsEnded(state === YOUTUBE_STATE.ENDED);

                            if (
                                state === YOUTUBE_STATE.PAUSED ||
                                state === YOUTUBE_STATE.CUED ||
                                state === YOUTUBE_STATE.ENDED
                            ) {
                                syncPlayerMetrics();
                            }
                        },
                        onPlaybackRateChange: (event) => {
                            if (!cancelled) {
                                setPlaybackRateState(event.data);
                            }
                        },
                        onError: () => {
                            if (!cancelled) {
                                setStatus('error');
                                setIsPlaying(false);
                                setIsBuffering(false);
                            }
                        },
                    },
                });
                playerRef.current = player;
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus('error');
                }
            });

        return () => {
            cancelled = true;
            playerRef.current = null;
            player?.destroy();
            mount.replaceChildren();
        };
    }, [resolvedVideoId, syncPlayerMetrics, title]);

    useEffect(() => {
        if (!isPlaying || isSeeking) {
            return;
        }

        let lastUpdate = 0;
        const update = (timestamp: number): void => {
            if (timestamp - lastUpdate >= 200) {
                syncPlayerMetrics();
                lastUpdate = timestamp;
            }
            progressFrameRef.current = window.requestAnimationFrame(update);
        };

        progressFrameRef.current = window.requestAnimationFrame(update);

        return () => {
            if (progressFrameRef.current !== null) {
                window.cancelAnimationFrame(progressFrameRef.current);
                progressFrameRef.current = null;
            }
        };
    }, [isPlaying, isSeeking, syncPlayerMetrics]);

    useEffect(() => {
        revealControls();
        return clearControlsTimer;
    }, [clearControlsTimer, revealControls]);

    useEffect(() => {
        const handleFullscreenChange = (): void => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () =>
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange,
            );
    }, []);

    useEffect(() => {
        if (!rateMenuOpen) {
            return;
        }

        const closeMenu = (event: PointerEvent): void => {
            if (
                rateMenuRef.current &&
                !rateMenuRef.current.contains(event.target as Node)
            ) {
                setRateMenuOpen(false);
            }
        };

        document.addEventListener('pointerdown', closeMenu);
        return () => document.removeEventListener('pointerdown', closeMenu);
    }, [rateMenuOpen]);

    useEffect(
        () => () => {
            clearControlsTimer();
            if (clickTimerRef.current !== null) {
                window.clearTimeout(clickTimerRef.current);
            }
            if (feedbackTimerRef.current !== null) {
                window.clearTimeout(feedbackTimerRef.current);
            }
        },
        [clearControlsTimer],
    );

    const togglePlayback = useCallback(() => {
        const player = playerRef.current;
        if (!player || status !== 'ready') {
            return;
        }

        if (isEnded) {
            player.seekTo(0, true);
            setCurrentTime(0);
            setIsEnded(false);
            player.playVideo();
        } else if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }

        revealControls();
    }, [isEnded, isPlaying, revealControls, status]);

    const showSeekFeedback = useCallback(
        (direction: 'backward' | 'forward', seconds: number) => {
            setSeekFeedback({ direction, seconds });
            if (feedbackTimerRef.current !== null) {
                window.clearTimeout(feedbackTimerRef.current);
            }
            feedbackTimerRef.current = window.setTimeout(() => {
                setSeekFeedback(null);
            }, SEEK_FEEDBACK_DURATION);
        },
        [],
    );

    const seekBy = useCallback(
        (seconds: number, showFeedback = false) => {
            const player = playerRef.current;
            if (!player || status !== 'ready') {
                return;
            }

            const maxDuration = player.getDuration() || duration;
            const nextTime = Math.min(
                maxDuration,
                Math.max(0, player.getCurrentTime() + seconds),
            );
            player.seekTo(nextTime, true);
            setCurrentTime(nextTime);
            setIsEnded(false);
            syncPlayerMetrics();
            revealControls();

            if (showFeedback) {
                showSeekFeedback(
                    seconds < 0 ? 'backward' : 'forward',
                    Math.abs(seconds),
                );
            }
        },
        [
            duration,
            revealControls,
            showSeekFeedback,
            status,
            syncPlayerMetrics,
        ],
    );

    const commitSeek = useCallback(
        (seconds: number) => {
            const nextTime = Math.min(duration, Math.max(0, seconds));
            playerRef.current?.seekTo(nextTime, true);
            setCurrentTime(nextTime);
            setIsEnded(false);
            isSeekingRef.current = false;
            setIsSeeking(false);
            revealControls();
        },
        [duration, revealControls],
    );

    const setVolume = useCallback(
        (nextVolume: number) => {
            const player = playerRef.current;
            if (!player) {
                return;
            }

            const normalizedVolume = Math.min(100, Math.max(0, nextVolume));
            player.setVolume(normalizedVolume);
            setVolumeState(normalizedVolume);

            if (normalizedVolume === 0) {
                player.mute();
                setIsMuted(true);
            } else {
                lastVolumeRef.current = normalizedVolume;
                player.unMute();
                setIsMuted(false);
            }
            revealControls();
        },
        [revealControls],
    );

    const toggleMute = useCallback(() => {
        const player = playerRef.current;
        if (!player) {
            return;
        }

        if (isMuted || volume === 0) {
            const restoredVolume = volume === 0 ? lastVolumeRef.current : volume;
            player.setVolume(restoredVolume);
            player.unMute();
            setVolumeState(restoredVolume);
            setIsMuted(false);
        } else {
            player.mute();
            setIsMuted(true);
        }
        revealControls();
    }, [isMuted, revealControls, volume]);

    const setPlaybackRate = useCallback(
        (rate: number) => {
            playerRef.current?.setPlaybackRate(rate);
            setPlaybackRateState(rate);
            setRateMenuOpen(false);
            revealControls();
        },
        [revealControls],
    );

    const setCaptionSize = useCallback(
        (size: number) => {
            if (!captionsAvailable) {
                return;
            }

            playerRef.current?.setOption('captions', 'fontSize', size);
            setCaptionFontSize(size);
            revealControls();
        },
        [captionsAvailable, revealControls],
    );

    const toggleFullscreen = useCallback(async () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        try {
            if (document.fullscreenElement === container) {
                await document.exitFullscreen();
            } else {
                await container.requestFullscreen();
            }
        } catch {
            // Fullscreen can be denied by browser or embedding policy.
        }
        revealControls();
    }, [revealControls]);

    const handlePlayerClick = (): void => {
        containerRef.current?.focus({ preventScroll: true });
        revealControls();

        if (clickTimerRef.current !== null) {
            window.clearTimeout(clickTimerRef.current);
        }
        clickTimerRef.current = window.setTimeout(() => {
            togglePlayback();
            clickTimerRef.current = null;
        }, CLICK_DELAY);
    };

    const handleDoubleClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        if (clickTimerRef.current !== null) {
            window.clearTimeout(clickTimerRef.current);
            clickTimerRef.current = null;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        const direction =
            event.clientX < bounds.left + bounds.width / 2 ? -10 : 10;
        seekBy(direction, true);
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
    ): void => {
        if (
            isTypingTarget(event.target) &&
            event.target !== event.currentTarget
        ) {
            return;
        }

        const key = event.key.toLowerCase();
        const actions: Record<string, () => void> = {
            ' ': togglePlayback,
            k: togglePlayback,
            arrowright: () => seekBy(5),
            arrowleft: () => seekBy(-5),
            arrowup: () => setVolume(volume + 5),
            arrowdown: () => setVolume(volume - 5),
            m: toggleMute,
            f: () => void toggleFullscreen(),
            j: () => seekBy(-10, true),
            l: () => seekBy(10, true),
        };

        const action = actions[key];
        if (!action) {
            return;
        }

        event.preventDefault();
        action();
        revealControls();
    };

    const playedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferedPercentage = Math.max(
        playedPercentage,
        loadedFraction * 100,
    );
    const effectiveMuted = isMuted || volume === 0;
    const VolumeIcon = effectiveMuted
        ? VolumeX
        : volume < 50
          ? Volume1
          : Volume2;
    const controlButtonClass =
        'flex size-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

    if (!resolvedVideoId) {
        return (
            <div className="flex aspect-video size-full items-center justify-center rounded-xl bg-black px-6 text-center text-sm text-white/75">
                Video tidak dapat diputar.
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'group/player relative aspect-video size-full overflow-hidden rounded-xl bg-black outline-none fullscreen:h-screen fullscreen:w-screen fullscreen:rounded-none',
                isPlaying && !showControls && 'cursor-none',
            )}
            tabIndex={0}
            role="application"
            aria-label={`Pemutar video: ${title}`}
            onClick={handlePlayerClick}
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleKeyDown}
            onPointerMove={revealControls}
            onPointerDown={revealControls}
            onMouseLeave={revealControls}
        >
            <div
                ref={playerMountRef}
                className="pointer-events-none absolute inset-0 size-full"
                aria-hidden="true"
            />

            {status === 'error' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black px-6 text-center text-sm text-white/75">
                    Video tidak dapat diputar.
                </div>
            )}

            {(status === 'loading' || isBuffering) && status !== 'error' && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                    <LoaderCircle
                        className="size-9 animate-spin text-white drop-shadow-lg"
                        aria-label="Memuat video"
                    />
                </div>
            )}

            {status === 'ready' && !isPlaying && !isBuffering && (
                <button
                    type="button"
                    className="absolute top-1/2 left-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-xl backdrop-blur-sm transition hover:scale-105 hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:size-20"
                    onClick={(event) => {
                        event.stopPropagation();
                        togglePlayback();
                    }}
                    aria-label={isEnded ? 'Putar ulang video' : 'Putar video'}
                >
                    {isEnded ? (
                        <RotateCcw className="size-7 sm:size-9" />
                    ) : (
                        <Play className="size-7 fill-current sm:size-9" />
                    )}
                </button>
            )}

            {seekFeedback && (
                <div
                    className={cn(
                        'pointer-events-none absolute top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm',
                        seekFeedback.direction === 'backward'
                            ? 'left-[18%]'
                            : 'right-[18%]',
                    )}
                >
                    {seekFeedback.direction === 'backward'
                        ? `↶ ${seekFeedback.seconds} detik`
                        : `${seekFeedback.seconds} detik ↷`}
                </div>
            )}

            {status === 'ready' && (
                <div
                    className={cn(
                        'absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pt-8 pb-3 font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-opacity duration-200 [&_svg]:stroke-[2.75] sm:px-4 sm:pt-10 sm:pb-4',
                        showControls
                            ? 'pointer-events-auto opacity-100'
                            : 'pointer-events-none opacity-0',
                    )}
                    onClick={(event) => event.stopPropagation()}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onMouseEnter={() => setControlsHovered(true)}
                    onMouseLeave={() => setControlsHovered(false)}
                >
                    <div className="group/progress relative flex h-5 items-center">
                        <div
                            className="pointer-events-none absolute inset-x-0 h-1 rounded-full transition-[height] group-hover/progress:h-1.5"
                            style={{
                                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${playedPercentage}%, rgba(255,255,255,.42) ${playedPercentage}%, rgba(255,255,255,.42) ${bufferedPercentage}%, rgba(255,255,255,.18) ${bufferedPercentage}%, rgba(255,255,255,.18) 100%)`,
                            }}
                        />
                        <input
                            type="range"
                            min={0}
                            max={Math.max(duration, 0.01)}
                            step={0.1}
                            value={Math.min(currentTime, Math.max(duration, 0.01))}
                            onChange={(event) => {
                                const nextTime = Number(event.target.value);
                                setCurrentTime(nextTime);
                                if (!isSeekingRef.current) {
                                    commitSeek(nextTime);
                                }
                            }}
                            onPointerDown={() => {
                                isSeekingRef.current = true;
                                setIsSeeking(true);
                                revealControls();
                            }}
                            onPointerUp={(event) =>
                                commitSeek(Number(event.currentTarget.value))
                            }
                            onPointerCancel={(event) =>
                                commitSeek(Number(event.currentTarget.value))
                            }
                            className="relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            aria-label="Posisi video"
                            aria-valuemin={0}
                            aria-valuemax={Math.round(duration)}
                            aria-valuenow={Math.round(currentTime)}
                            aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
                        />
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                            <button
                                type="button"
                                className={controlButtonClass}
                                onClick={togglePlayback}
                                aria-label={
                                    isPlaying ? 'Jeda video' : 'Putar video'
                                }
                                title={isPlaying ? 'Jeda (K)' : 'Putar (K)'}
                            >
                                {isPlaying ? (
                                    <Pause className="size-5 fill-current" />
                                ) : isEnded ? (
                                    <RotateCcw className="size-5" />
                                ) : (
                                    <Play className="size-5 fill-current" />
                                )}
                            </button>
                            <button
                                type="button"
                                className={cn(controlButtonClass, 'size-9')}
                                onClick={() => seekBy(-5, true)}
                                aria-label="Mundur 5 detik"
                                title="Mundur 5 detik"
                            >
                                <Rewind className="size-4 fill-current" />
                            </button>
                            <button
                                type="button"
                                className={cn(controlButtonClass, 'size-9')}
                                onClick={() => seekBy(5, true)}
                                aria-label="Maju 5 detik"
                                title="Maju 5 detik"
                            >
                                <FastForward className="size-4 fill-current" />
                            </button>
                            <span className="hidden whitespace-nowrap text-[11px] font-bold tabular-nums text-white md:inline md:text-xs">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-0.5 sm:gap-1">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className={controlButtonClass}
                                    onClick={toggleMute}
                                    aria-label={
                                        effectiveMuted
                                            ? 'Aktifkan suara'
                                            : 'Bisukan audio'
                                    }
                                    title={
                                        effectiveMuted
                                            ? 'Aktifkan suara (M)'
                                            : 'Bisukan (M)'
                                    }
                                >
                                    <VolumeIcon className="size-5" />
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={effectiveMuted ? 0 : volume}
                                    onChange={(event) =>
                                        setVolume(Number(event.target.value))
                                    }
                                    onPointerDown={() =>
                                        setIsVolumeInteracting(true)
                                    }
                                    onPointerUp={() =>
                                        setIsVolumeInteracting(false)
                                    }
                                    onPointerCancel={() =>
                                        setIsVolumeInteracting(false)
                                    }
                                    className="hidden h-5 w-20 cursor-pointer accent-white sm:block"
                                    aria-label="Volume"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={effectiveMuted ? 0 : volume}
                                />
                            </div>

                            <div ref={rateMenuRef} className="relative">
                                {rateMenuOpen && (
                                    <div className="absolute right-0 bottom-12 w-64 overflow-hidden rounded-lg border border-white/15 bg-black/95 p-3 text-sm text-white shadow-xl backdrop-blur-md">
                                        <p className="text-xs font-bold text-white/70">
                                            Kecepatan
                                        </p>
                                        <div className="mt-2 grid grid-cols-4 gap-1">
                                            {availablePlaybackRates.map(
                                                (rate) => (
                                                    <button
                                                        key={rate}
                                                        type="button"
                                                        className={cn(
                                                            'flex h-9 items-center justify-center rounded-md transition hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none',
                                                            playbackRate ===
                                                                rate &&
                                                                'bg-white/20 font-bold',
                                                        )}
                                                        onClick={() =>
                                                            setPlaybackRate(rate)
                                                        }
                                                        aria-label={`Kecepatan ${rate} kali`}
                                                    >
                                                        {rate}x
                                                    </button>
                                                ),
                                            )}
                                        </div>

                                        <div className="mt-3 border-t border-white/15 pt-3">
                                            <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                                                <Captions className="size-4" />
                                                Subtitle
                                            </div>
                                            {captionsAvailable ? (
                                                <div className="mt-2 grid grid-cols-3 gap-1">
                                                    {[
                                                        [-1, 'Kecil'],
                                                        [0, 'Normal'],
                                                        [1, 'Besar'],
                                                    ].map(([size, label]) => (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            className={cn(
                                                                'h-9 rounded-md text-xs transition hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none',
                                                                captionFontSize ===
                                                                    size &&
                                                                    'bg-white/20 font-bold',
                                                            )}
                                                            onClick={() =>
                                                                setCaptionSize(
                                                                    Number(size),
                                                                )
                                                            }
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-xs text-white/55">
                                                    Tidak tersedia pada video ini
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-3 space-y-2 border-t border-white/15 pt-3 text-xs">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-white/65">
                                                    Resolusi
                                                </span>
                                                <strong>Otomatis</strong>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-white/65">
                                                    Dubbing
                                                </span>
                                                <strong>YouTube</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-2 text-xs font-bold text-white transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    onClick={() =>
                                        setRateMenuOpen((open) => !open)
                                    }
                                    aria-label="Buka pengaturan video"
                                    aria-expanded={rateMenuOpen}
                                    title="Pengaturan video"
                                >
                                    <Settings className="size-4 sm:hidden" />
                                    <span className="hidden sm:inline">
                                        {playbackRate}x
                                    </span>
                                </button>
                            </div>

                            <button
                                type="button"
                                className={controlButtonClass}
                                onClick={() => void toggleFullscreen()}
                                aria-label={
                                    isFullscreen
                                        ? 'Keluar dari layar penuh'
                                        : 'Layar penuh'
                                }
                                title={
                                    isFullscreen
                                        ? 'Keluar layar penuh (F)'
                                        : 'Layar penuh (F)'
                                }
                            >
                                {isFullscreen ? (
                                    <Minimize className="size-5" />
                                ) : (
                                    <Maximize className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
