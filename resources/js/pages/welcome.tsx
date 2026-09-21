import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    MonitorPlay,
    UserRound,
    UsersRound,
    Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Course = {
    id: number;
    slug: string;
    title: string;
    short_description: string | null;
    thumbnail_url: string | null;
    estimated_duration_minutes: number | null;
    category: { id: number; name: string; slug: string };
    teacher: {
        id: number;
        name: string;
        photo_url: string | null;
        expertise: string | null;
    } | null;
    videos_count: number;
    enrollments_count: number;
};

const primaryLinkClass =
    'inline-flex items-center gap-2 text-[13px] font-bold text-[#1054D0] transition hover:text-[#0C46B8]';
const sectionClass =
    'mx-auto max-w-[1370px] px-11 py-[72px] max-[1100px]:px-[25px] max-[760px]:px-[22px] max-[760px]:py-[55px]';
const kickerClass =
    'relative block pl-[27px] text-[10px] font-bold tracking-[1.2px] text-[#1054D0] before:absolute before:left-0 before:top-[5px] before:h-0.5 before:w-5 before:bg-[#1054D0]';

const heroSlides = [
    {
        src: '/welcome/hero1.png',
        alt: 'Pelajar sedang belajar di lingkungan kampus',
    },
    {
        src: '/welcome/hero2.png',
        alt: 'Pelajar sedang belajar bersama secara online',
    },
    {
        src: '/welcome/hero3.png',
        alt: 'Pelajar sedang belajar bersama secara online',
    },
] as const;

const formatCount = (value: number): string =>
    new Intl.NumberFormat('id-ID').format(value);

const formatDuration = (minutes: number | null): string => {
    if (!minutes) return 'Durasi fleksibel';
    if (minutes < 60) return `${minutes} menit`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes
        ? `${hours} jam ${remainingMinutes} menit`
        : `${hours} jam`;
};

export default function Welcome({ courses }: { courses: Course[] }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const updateMotionPreference = (): void => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        updateMotionPreference();
        mediaQuery.addEventListener('change', updateMotionPreference);

        return () =>
            mediaQuery.removeEventListener('change', updateMotionPreference);
    }, []);

    useEffect(() => {
        if (isPaused || prefersReducedMotion) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveSlide((currentSlide) =>
                (currentSlide + 1) % heroSlides.length,
            );
        }, 5000);

        return () => window.clearInterval(interval);
    }, [isPaused, prefersReducedMotion]);

    return (
        <>
            <Head title="Eduo - Pelatihan Online Langsung" />
            <section
                className="relative mx-auto my-4 block w-[calc(100%-88px)] max-w-[1282px] overflow-hidden rounded-[32px] bg-[#070B49] max-[1100px]:w-[calc(100%-50px)] max-[1100px]:rounded-[26px] max-[760px]:my-2.5 max-[760px]:w-[calc(100%-44px)] max-[760px]:rounded-[18px]"
                id="home"
                aria-label="Promosi kelas Eduo"
                aria-roledescription="carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsPaused(false);
                    }
                }}
            >
                <h1 className="sr-only">
                    Belajar hari ini untuk tumbuh menuju masa depan
                </h1>
                <div
                    className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                    {heroSlides.map((slide) => (
                        <Link
                            key={slide.src}
                            className="group block w-full shrink-0 focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#2478E4]"
                            href="/courses"
                            aria-label="Lihat katalog kelas"
                            tabIndex={0}
                        >
                            <img
                                className="block h-auto w-full transition-[filter] duration-200 group-hover:brightness-[0.98]"
                                src={slide.src}
                                alt={slide.alt}
                            />
                        </Link>
                    ))}
                </div>
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm max-[760px]:bottom-3">
                    {heroSlides.map((slide, index) => (
                        <button
                            key={slide.src}
                            type="button"
                            className="size-2.5 rounded-full bg-white/60 transition-[width,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            style={
                                activeSlide === index
                                    ? { width: '1.5rem', backgroundColor: 'white' }
                                    : undefined
                            }
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Tampilkan slide ${index + 1}`}
                            aria-current={activeSlide === index}
                        />
                    ))}
                </div>
            </section>

            <section className="bg-white">
                <section className={`${sectionClass} pb-0`} id="courses">
                    <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                        <div>
                            <span className={kickerClass}>KELAS POPULER</span>
                            <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                Ikuti Kelas online Kami
                            </h2>
                            <p className="mt-[7px] text-[13px] leading-[1.55] text-[#59648A]">
                                Pelajari keterampilan praktis lewat kelas
                                langsung bersama instruktur untuk berkembang
                                dengan percaya diri.
                            </p>
                        </div>
                        <Link href="/courses" className={primaryLinkClass}>
                            Lihat Semua Kelas <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 pb-5 md:grid-cols-2 xl:grid-cols-3">
                        {courses.map((course) => (
                            <Link
                                href={`/courses/${course.slug}`}
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E3E8F2] bg-white shadow-[0_8px_28px_rgba(25,67,130,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(25,67,130,0.12)]"
                                key={course.id}
                            >
                                <div className="relative flex h-[175px] items-start overflow-hidden p-[13px]">
                                    <img
                                        className="absolute inset-0 size-full object-cover"
                                        src={
                                            course.thumbnail_url ||
                                            '/course-placeholder.svg'
                                        }
                                        alt=""
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.src =
                                                '/course-placeholder.svg';
                                        }}
                                    />
                                    <span className="relative z-10 rounded-full bg-white px-[13px] py-[7px] text-[11px] font-bold text-[#1054D0]">
                                        {course.category.name}
                                    </span>
                                </div>

                                <div className="px-4 pt-[15px]">
                                    <h3 className="mb-[7px] text-base font-bold">
                                        {course.title}
                                    </h3>
                                    <p className="mb-4 min-h-[36px] text-sm leading-[1.5] text-[#59648A]">
                                        {course.short_description ||
                                            'Pelajari keterampilan baru melalui materi yang terstruktur dan mudah diikuti.'}
                                    </p>
                                    <div className="flex items-center gap-[9px]">
                                        {course.teacher?.photo_url ? (
                                            <img
                                                src={course.teacher.photo_url}
                                                alt={`Foto ${course.teacher.name}`}
                                                className="size-[37px] shrink-0 rounded-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        '/bri-peduli.webp';
                                                }}
                                            />
                                        ) : (
                                            <span className="inline-flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#DCECFC] text-[#1054D0]">
                                                <UserRound size={18} />
                                            </span>
                                        )}
                                        <div>
                                            <strong className="block text-xs">
                                                {course.teacher?.name ||
                                                    'Tim BRI Peduli'}
                                            </strong>
                                            <small className="mt-[3px] block text-[10px] text-[#7D89A8]">
                                                {course.teacher?.expertise ||
                                                    'Instruktur pembelajaran'}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E3E8F2] py-[13px] text-[10px]">
                                        <span className="flex items-center gap-[5px] text-[#59648A]">
                                            <Clock3
                                                size={16}
                                                className="text-[#1054D0]"
                                            />
                                            {formatDuration(
                                                course.estimated_duration_minutes,
                                            )}
                                        </span>
                                        <span className="flex items-center gap-[5px] text-[#59648A]">
                                            <Video
                                                size={16}
                                                className="text-[#1054D0]"
                                            />
                                            {formatCount(course.videos_count)}{' '}
                                            video
                                        </span>
                                        <span className="flex items-center gap-[5px] text-[#59648A]">
                                            <UsersRound
                                                size={16}
                                                className="text-[#1054D0]"
                                            />
                                            {formatCount(
                                                course.enrollments_count,
                                            )}{' '}
                                            siswa
                                        </span>
                                        <span className="ml-auto flex items-center gap-[5px] font-bold text-[#1054D0] group-hover:text-[#0C46B8]">
                                            Lihat Kelas
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {courses.length === 0 && (
                        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D9E5F4] px-6 py-14 text-center">
                            <BookOpen className="size-10 text-[#9BB2D5]" />
                            <h3 className="mt-4 text-lg font-bold text-[#071457]">
                                Belum ada kelas tersedia
                            </h3>
                            <p className="mt-2 max-w-md text-sm text-[#61719B]">
                                Kelas baru akan muncul di sini setelah
                                dipublikasikan.
                            </p>
                        </div>
                    )}
                </section>
            </section>
        </>
    );
}
