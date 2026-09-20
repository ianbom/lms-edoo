import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    LayoutGrid,
    PlayCircle,
    UserRound,
    Video,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Content = {
    id: number;
    title: string;
    type: 'video' | 'textbook';
    description: string | null;
    youtube_video_id: string | null;
    video_duration_seconds: number | null;
};
type Material = {
    id: number;
    title: string;
    description: string | null;
    contents: Content[];
};
type Course = {
    slug: string;
    title: string;
    short_description: string | null;
    description: string | null;
    thumbnail_url: string | null;
    banner_url: string | null;
    estimated_duration_minutes: number | null;
    published_at: string | null;
    category: { name: string; slug: string };
    teacher: { name: string; photo_url: string | null; expertise: string | null } | null;
    modules_count: number;
    videos_count: number;
    preview_video_id: string | null;
    materials: Material[];
};

const formatDate = (value: string | null): string =>
    value
        ? new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          }).format(new Date(value))
        : 'Tanggal belum tersedia';

const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '—';

    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    return `${minutes}:${String(remainder).padStart(2, '0')}`;
};

function Preview({ course }: { course: Course }) {
    if (course.preview_video_id) {
        return (
            <div className="aspect-video overflow-hidden rounded-[3px] bg-primary/10 shadow-sm">
                <iframe
                    className="size-full"
                    src={`https://www.youtube.com/embed/${encodeURIComponent(course.preview_video_id)}?rel=0&modestbranding=1`}
                    title={`Preview ${course.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <img
            src={course.banner_url || course.thumbnail_url || '/course-placeholder.svg'}
            alt=""
            className="aspect-video w-full rounded-[3px] object-cover shadow-sm"
            onError={(event) => {
                event.currentTarget.src = '/course-placeholder.svg';
            }}
        />
    );
}

export default function CourseDetail({ course }: { course: Course }) {
    const [enrolling, setEnrolling] = useState(false);
    const enroll = (): void => {
        setEnrolling(true);
        router.post(`/courses/${course.slug}/enroll`, {}, {
            onFinish: () => setEnrolling(false),
        });
    };

    return (
        <>
            <Head title={course.title} />

            <section className="bg-white px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-7">
                    <div>
                        <Preview course={course} />

                        <div className="mt-5">
                            <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold tracking-wide text-primary uppercase">
                                {course.category.name}
                            </span>
                            <h1 className="mt-3 max-w-4xl text-[27px] leading-[1.13] font-extrabold tracking-[-0.8px] text-[#061557] sm:text-[31px]">
                                {course.title}
                            </h1>
                            <p className="mt-3 max-w-4xl whitespace-pre-line text-[14px] leading-[1.72] text-[#536992]">
                                {course.description || course.short_description || 'Deskripsi kelas belum tersedia.'}
                            </p>
                        </div>

                        <section className="mt-8">
                            <h2 className="text-[17px] font-bold text-[#071457]">Daftar Modul</h2>
                            <div className="mt-3 space-y-3">
                                {course.materials.map((material) => (
                                    <Card key={material.id} className="gap-0 rounded-[4px] border-[#DDE5F1] py-0 shadow-none">
                                        <CardHeader className="gap-1 px-4 pt-4 pb-3">
                                            <CardTitle className="text-[13px] font-bold leading-snug text-[#10255D]">
                                                {material.title}
                                            </CardTitle>
                                            {material.description && <CardDescription className="text-[11px] leading-[1.6] text-[#5D7095]">{material.description}</CardDescription>}
                                        </CardHeader>
                                        <CardContent className="space-y-2 border-t border-[#E5EAF2] px-4 py-3">
                                            {material.contents.map((content) => (
                                                <div key={content.id} className="flex items-center gap-2 text-[12px] text-[#16316B]">
                                                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                                                        {content.type === 'video' ? <PlayCircle size={13} /> : <FileText size={12} />}
                                                    </span>
                                                    <span className="min-w-0 flex-1 truncate">{content.title}</span>
                                                    {content.type === 'video' && <span className="text-[11px] text-[#6980A5]">{formatDuration(content.video_duration_seconds)}</span>}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                ))}
                                {course.materials.length === 0 && <p className="rounded border border-dashed border-[#DDE5F1] px-4 py-8 text-center text-sm text-[#607198]">Modul akan segera tersedia.</p>}
                            </div>
                        </section>
                    </div>

                    <aside className="self-start lg:sticky lg:top-20">
                        <Card className="gap-0 rounded-[7px] border-[#DAE1EC] py-0 shadow-[0_2px_5px_rgba(12,35,78,0.05)]">
                            <CardHeader className="px-5 pt-5 pb-2">
                                <CardDescription className="text-[11px] text-[#596B8C]">Kelas Gratis</CardDescription>
                                <CardTitle className="text-[25px] font-extrabold tracking-[-0.5px] text-[#162035]">Gratis</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 pb-3 text-[12px] text-[#4C607E]">
                                <span className="flex items-center gap-2"><PlayCircle size={15} className="text-primary" />{course.videos_count} Video</span>
                                <span className="flex items-center gap-2"><Clock3 size={15} className="text-primary" />{course.estimated_duration_minutes ?? 0}m</span>
                                <span className="flex items-center gap-2"><LayoutGrid size={15} className="text-primary" />{course.modules_count} Modul</span>
                                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-primary" />0 Kuis</span>
                                <span className="col-span-2 flex items-center gap-2 italic"><BookOpen size={15} className="text-primary" />Belajar mandiri</span>
                                <span className="col-span-2 flex items-center gap-2"><CalendarDays size={15} className="text-primary" />{formatDate(course.published_at)}</span>
                            </CardContent>
                            <CardFooter className="px-5 pt-2 pb-5">
                                <button type="button" onClick={enroll} disabled={enrolling} className="flex h-10 w-full items-center justify-center gap-2 rounded-[7px] bg-primary text-[12px] font-bold text-primary-foreground shadow-[0_3px_6px_rgba(16,84,208,0.2)] disabled:cursor-not-allowed disabled:opacity-60">{enrolling ? 'Mendaftarkan...' : 'Daftar Kelas'} <PlayCircle size={15} /></button>
                            </CardFooter>
                        </Card>

                        <Card className="mt-3 gap-0 rounded-[7px] border-[#DAE1EC] py-0 shadow-[0_2px_5px_rgba(12,35,78,0.04)]">
                            <CardHeader className="px-5 pt-4 pb-3">
                                <CardDescription className="text-[10px] font-semibold text-[#596B8C] uppercase">Trainer kelas</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center gap-3 px-5 pb-4">
                                {course.teacher?.photo_url ? <img src={course.teacher.photo_url} alt={course.teacher.name} className="size-10 rounded-full object-cover" /> : <span className="grid size-10 place-items-center rounded-full bg-[#E6EEF9] text-[#1A5FD0]"><UserRound size={20} /></span>}
                                <div>
                                    <p className="text-[12px] font-bold text-[#1B2742]">{course.teacher?.name || 'Instruktur belum ditentukan'}</p>
                                    <p className="text-[10px] text-[#71809A]">{course.teacher?.expertise || 'Trainer kelas EduLearn'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </section>
        </>
    );
}
