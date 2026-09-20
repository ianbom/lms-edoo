type VideoPlayerProps = {
    videoId: string;
    title: string;
};

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
    const parameters = new URLSearchParams({
        controls: '1',
        fs: '1',
        playsinline: '1',
        rel: '0',
    });

    return (
        <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${parameters.toString()}`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    );
}
