import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Layers3,
    PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ClassItem = {
    id: number;
    status: 'enrolled' | 'in_progress' | 'completed';
    progress: number;
    enrolled_at: string | null;
    last_activity_at: string | null;
    available: boolean;
    course: {
        id: number;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        short_description: string | null;
        category: string | null;
        teacher: string | null;
        materials_count: number;
        contents_count: number;
    };
};
type Classes = {
    data: ClassItem[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

const statusLabel = (status: ClassItem['status']): string =>
    status === 'completed'
        ? 'Selesai'
        : status === 'in_progress'
            ? 'Sedang dipelajari'
            : 'Belum dimulai';

export default function MyClass({ classes }: { classes: Classes }) {
    return (
        <>
            <Head title="Kelas Saya" />
            <div className="px-5 pb-8 sm:px-7 lg:px-8">
                <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold tracking-[.16em] text-[#1064db] uppercase">
                            Pembelajaran Saya
                        </p>
                        <h1 className="mt-2 text-[28px] leading-none font-extrabold tracking-[-.8px] text-[#101b5d]">
                            Kelas Saya
                        </h1>
                        <p className="mt-2 text-sm text-[#5972a0]">
                            Lanjutkan kelas yang sudah kamu daftarkan.
                        </p>
                    </div>
                    <div className="rounded-xl border border-[#dbe9fa] bg-white px-4 py-3 text-sm text-[#506b9d]">
                        <span className="font-extrabold text-[#1064db]">
                            {classes.total ?? classes.data.length}
                        </span>{' '}
                        kelas terdaftar
                    </div>
                </header>
                {classes.data.length > 0 ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                            {classes.data.map((item) => (
                                <Card
                                    key={item.id}
                                    role="article"
                                    className="gap-0 overflow-hidden rounded-[14px] border-[#E2EAF5] bg-white py-0 shadow-[0_3px_12px_rgba(20,74,143,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(20,74,143,0.1)]"
                                >
                                    <div className="relative h-[194px] overflow-hidden">
                                        <img
                                            src={
                                                item.course.thumbnail_url ||
                                                '/course-placeholder.svg'
                                            }
                                            alt=""
                                            className="size-full object-cover"
                                            onError={(event) => {
                                                event.currentTarget.src =
                                                    '/course-placeholder.svg';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#071533]/80 via-[#071533]/10 to-transparent" />
                                        <span
                                            className={`absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold shadow-sm ${item.status === 'completed' ? 'text-[#15965a]' : 'text-[#1167e8]'}`}
                                        >
                                            {item.status === 'completed' ? (
                                                <CheckCircle2 size={13} />
                                            ) : (
                                                <Clock3 size={13} />
                                            )}
                                            {statusLabel(item.status)}
                                        </span>
                                    </div>
                                    <CardContent className="flex min-h-[198px] flex-col p-6 pt-4">
                                        <p className="text-sm font-semibold text-[#365D9C]">
                                            {item.course.category || 'Kelas Online'}
                                        </p>
                                        <h2 className="mt-1 line-clamp-2 text-[20px] leading-[1.12] font-extrabold tracking-[-0.6px] text-[#071457]">
                                            {item.course.title}
                                        </h2>
                                        <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.3] text-[#61719B]">
                                            {item.course.short_description ||
                                                'Pelajari materi berkualitas sesuai alur belajar yang tersedia.'}
                                        </p>
                                        <div className="mt-auto pt-4">
                                            <div className="flex items-center gap-6 text-[13px] font-medium text-[#5E719D]">
                                                <span className="flex items-center gap-2">
                                                    <GraduationCap size={17} />
                                                    {item.course.teacher ||
                                                        'Instruktur Edoo'}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Layers3 size={17} />
                                                    {item.course.materials_count}{' '}
                                                    materi
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <div className="mb-2 flex justify-between text-[11px]">
                                                    <span className="font-semibold text-[#486491]">
                                                        Progress Belajar
                                                    </span>
                                                    <span className="font-extrabold text-[#1064db]">
                                                        {Math.round(item.progress)}%
                                                    </span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-[#e3f0ff]">
                                                    <div
                                                        className="h-full rounded-full bg-[#1167e8]"
                                                        style={{
                                                            width: `${Math.min(100, item.progress)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-5">
                                                {item.available ? (
                                                    <Button
                                                        asChild
                                                        className="w-full bg-[#1167e8] text-white hover:bg-[#075ad0]"
                                                    >
                                                        <Link
                                                            href={`/student/classes/${item.course.slug}/study`}
                                                        >
                                                            {item.status ===
                                                            'completed'
                                                                ? 'Buka Kembali'
                                                                : item.status ===
                                                                    'in_progress'
                                                                  ? 'Lanjutkan Belajar'
                                                                  : 'Mulai Belajar'}
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="w-full"
                                                        variant="outline"
                                                        disabled
                                                    >
                                                        <Clock3 />
                                                        Kelas belum tersedia
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {classes.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between rounded-xl border border-[#dce9f8] bg-white px-5 py-4 text-sm">
                                <span className="text-[#5d76a1]">
                                    Halaman {classes.current_page} dari{' '}
                                    {classes.last_page}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        disabled={!classes.prev_page_url}
                                    >
                                        <Link
                                            href={classes.prev_page_url ?? '#'}
                                        >
                                            Sebelumnya
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        disabled={!classes.next_page_url}
                                    >
                                        <Link
                                            href={classes.next_page_url ?? '#'}
                                        >
                                            Selanjutnya
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <section
                        className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfe0f5] bg-white px-6 text-center"
                    >
                        <span className="grid size-16 place-items-center rounded-full bg-[#e7f3ff] text-[#1064db]">
                            <BookOpen size={30} />
                        </span>
                        <h2 className="mt-5 text-xl font-extrabold text-[#101b5d]">
                            Belum ada kelas
                        </h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#5a73a1]">
                            Daftarkan kelas dari katalog untuk memulai
                            perjalanan belajarmu.
                        </p>
                        <Button
                            asChild
                            className="mt-6 bg-[#1167e8] text-white hover:bg-[#075ad0]"
                        >
                            <Link href="/courses">
                                Jelajahi kelas <PlayCircle />
                            </Link>
                        </Button>
                    </section>
                )}
            </div>
        </>
    );
}
