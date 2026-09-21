import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Clock3,
    GraduationCap,
    Search,
    UsersRound,
    Video,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Category = { id: number; name: string; slug: string };
type Course = {
    id: number;
    slug: string;
    title: string;
    short_description: string | null;
    thumbnail_url: string | null;
    category: Category;
    videos_count: number;
    enrollments_count: number;
};
const formatCount = (value: number): string =>
    new Intl.NumberFormat('id-ID').format(value);

function courseUrl(category = '', search = ''): string {
    const query = new URLSearchParams();

    if (category) query.set('category', category);
    if (search) query.set('search', search);

    const suffix = query.toString();

    return suffix ? `/courses?${suffix}` : '/courses';
}

function CourseCard({ course }: { course: Course }) {
    return (
        <a
            href={`/courses/${course.slug}`}
            className="block"
            aria-label={`Buka kelas ${course.title}`}
        >
            <Card
                role="article"
                className="gap-0 overflow-hidden rounded-[14px] border-[#E2EAF5] bg-white py-0 shadow-[0_3px_12px_rgba(20,74,143,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(20,74,143,0.1)]"
            >
                <div className="relative h-[194px] overflow-hidden">
                    <img
                        src={course.thumbnail_url || '/course-placeholder.svg'}
                        alt=""
                        className="size-full object-cover"
                        onError={(event) => {
                            event.currentTarget.src = '/course-placeholder.svg';
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#071533]/80 via-[#071533]/10 to-transparent" />
                </div>

                <CardContent className="flex min-h-[198px] flex-col p-6 pt-4">
                    <p className="text-sm font-semibold text-[#365D9C]">
                        {course.category.name}
                    </p>
                    <h2 className="mt-1 text-[20px] leading-[1.12] font-extrabold tracking-[-0.6px] text-[#071457]">
                        {course.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.3] text-[#61719B]">
                        {course.short_description ||
                            'Mulai perjalanan belajar Anda bersama materi pilihan.'}
                    </p>
                    <div className="mt-auto pt-4">
                        <div className="flex items-center gap-6 text-[13px] font-medium text-[#5E719D]">
                            <span className="flex items-center gap-2">
                                <Video size={17} strokeWidth={2.5} />
                                {formatCount(course.videos_count)} video
                            </span>
                            <span className="flex items-center gap-2">
                                <UsersRound
                                    size={17}
                                    className="text-[#F2A817]"
                                    strokeWidth={2.5}
                                />
                                {formatCount(course.enrollments_count)} siswa
                            </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-[23px] leading-none font-extrabold tracking-[-0.7px] text-[#105BDD]">
                                Gratis
                            </span>
                            <span
                                className="grid size-10 place-items-center rounded-full bg-[#EAF4FF] text-[#1261DE]"
                                aria-hidden="true"
                            >
                                <ArrowRight size={23} strokeWidth={2.25} />
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}

export default function CourseCatalog({
    courses,
    categories,
    filters,
}: {
    courses: Course[];
    categories: Category[];
    filters: { search: string; category: string };
}) {
    return (
        <>
            <Head title="Kelas Populer" />

            <section className="bg-[#F8FBFF] px-5 py-8 sm:px-8 lg:px-12 lg:py-9">
                <div className="mx-auto max-w-[1356px]">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h1 className="text-[30px] leading-none font-extrabold tracking-[-1.2px] text-[#071457] sm:text-[34px]">
                                Kelas Populer
                            </h1>
                            <p className="mt-1 text-[15px] leading-tight text-[#60709A] sm:text-base">
                                Pilih kelas yang sesuai dengan kebutuhanmu
                            </p>
                        </div>
                        <nav
                            className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:pt-1"
                            aria-label="Filter kategori kelas"
                        >
                            <Link
                                href={courseUrl('', filters.search)}
                                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                                    !filters.category
                                        ? 'border-[#105BDD] bg-[#105BDD] text-white shadow-[0_4px_8px_rgba(16,91,221,0.22)]'
                                        : 'border-[#D9E4F5] bg-white text-[#50618C] hover:border-[#105BDD] hover:text-[#105BDD]'
                                }`}
                            >
                                Semua
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={courseUrl(
                                        category.slug,
                                        filters.search,
                                    )}
                                    className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                                        filters.category === category.slug
                                            ? 'border-[#105BDD] bg-[#105BDD] text-white shadow-[0_4px_8px_rgba(16,91,221,0.22)]'
                                            : 'border-[#D9E4F5] bg-white text-[#50618C] hover:border-[#105BDD] hover:text-[#105BDD]'
                                    }`}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {filters.search && (
                        <p className="mt-5 text-sm text-[#60709A]">
                            Hasil pencarian untuk{' '}
                            <strong className="text-[#071457]">
                                “{filters.search}”
                            </strong>
                        </p>
                    )}

                    <div className="mt-5 grid gap-[18px] md:grid-cols-2 xl:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    {courses.length > 0 && (
                        <section className="relative mt-8 overflow-hidden rounded-[18px] bg-[#105BDD] px-6 py-8 text-white sm:px-9 sm:py-9">
                            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                        <GraduationCap size={18} />
                                        BELAJAR BERSAMA
                                    </div>
                                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.8px] sm:text-3xl">
                                        Siap mulai belajar?
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">
                                        Buat akun untuk mengikuti kelas pilihan,
                                        menyimpan progres, dan belajar sesuai
                                        ritmemu.
                                    </p>
                                </div>
                                <Link
                                    href="/register"
                                    className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#105BDD] transition hover:bg-[#EAF4FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Daftar Sekarang
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                            <div className="absolute -right-20 -bottom-28 size-64 rounded-full border-[28px] border-white/10" />
                            <div className="absolute -top-16 right-1/3 size-32 rounded-full border-[18px] border-white/10" />
                        </section>
                    )}

                    {courses.length === 0 && (
                        <div className="mt-5 rounded-[14px] border border-dashed border-[#C9D9F0] bg-white px-6 py-20 text-center">
                            <Search className="mx-auto size-9 text-[#105BDD]" />
                            <h2 className="mt-4 text-xl font-bold text-[#071457]">
                                Kelas belum ditemukan
                            </h2>
                            <p className="mt-1 text-[#60709A]">
                                Coba kata kunci atau kategori lain.
                            </p>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}
