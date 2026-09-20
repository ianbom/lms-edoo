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
    return (
        <>
            <Head title="Eduo - Live Online Training" />
            <section
                className="relative mx-auto flex aspect-[2048/1148] max-w-[1370px] overflow-hidden bg-[#070B49] max-[1100px]:mx-[18px] max-[760px]:mx-2.5 max-[760px]:aspect-auto max-[760px]:h-[480px]"
                id="home"
            >
                <img
                    className="block size-full object-cover max-[760px]:object-[34%_center]"
                    src="/welcome/hero-online-training.png"
                    alt="Expert instructor teaching a live online class"
                />
                <h1 className="sr-only">
                    Our Live Online Training Is Taught By Expert Instructors
                </h1>
                <Link
                    className="absolute top-[58%] left-[10.3%] z-[4] h-[9%] w-[27%] rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2478E4] max-[760px]:left-[8%] max-[760px]:h-[10%] max-[760px]:w-[52%]"
                    href="#courses"
                    aria-label="Browse our course catalog"
                />
            </section>

            <section
                className="mx-auto grid max-w-[1370px] grid-cols-3 gap-[35px] bg-[#EEF6FF] px-11 py-[58px] max-[1100px]:mx-[18px] max-[1100px]:px-[25px] max-[1100px]:py-11 max-[760px]:mx-0 max-[760px]:block max-[760px]:px-[22px] max-[760px]:py-[35px]"
                aria-label="Eduo benefits"
            >
                {(
                    [
                        [CalendarDays, 'Class Schedule'],
                        [MonitorPlay, 'Interactive Led Online Advantage'],
                        [UsersRound, '100% Satisfaction Guaranteed'],
                    ] as const
                ).map(([Icon, title]) => (
                    <div
                        className="flex items-start gap-[18px] border-r border-[#E3E8F2] pr-[35px] last:border-r-0 max-[760px]:mb-5 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:pr-0 max-[760px]:pb-5 max-[760px]:last:mb-0 max-[760px]:last:border-b-0 max-[760px]:last:pb-0"
                        key={title}
                    >
                        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-[#DCECFC] text-[#1054D0]">
                            <Icon size={25} />
                        </span>
                        <div>
                            <h3 className="mt-1 mb-[9px] text-sm font-bold">
                                {title}
                            </h3>
                            <p className="text-xs leading-[1.65] text-[#59648A]">
                                Eduo provides engaging instructor led content
                                for people everywhere and of all ages without
                                having to leave the house.
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="bg-white">
                <section className={`${sectionClass} pb-0`} id="courses">
                    <div className="mb-7 flex items-end justify-between max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-[17px]">
                        <div>
                            <span className={kickerClass}>POPULAR CLASSES</span>
                            <h2 className="mt-3 text-[clamp(28px,3vw,39px)] leading-[1.16] font-extrabold tracking-[-1.5px]">
                                Join Our Online Classes
                            </h2>
                            <p className="mt-[7px] text-[13px] leading-[1.55] text-[#59648A]">
                                Learn practical skills through live,
                                instructor-led classes designed to help you grow
                                with confidence.
                            </p>
                        </div>
                        <Link href="/courses" className={primaryLinkClass}>
                            Lihat Semua Kelas <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                                    <p className="mb-4 min-h-[36px] text-xs leading-[1.5] text-[#59648A]">
                                        {course.short_description ||
                                            'Pelajari keterampilan baru melalui materi yang terstruktur dan mudah diikuti.'}
                                    </p>
                                    <div className="flex items-center gap-[9px]">
                                        <span className="inline-flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#DCECFC] text-[#1054D0]">
                                            <UserRound size={18} />
                                        </span>
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
