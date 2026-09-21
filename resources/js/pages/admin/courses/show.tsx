import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock3,
    FileText,
    GraduationCap,
    Layers3,
    Pencil,
    PlayCircle,
    Users,
    Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { edit } from '@/actions/App/Http/Controllers/Admin/CourseController';
import { show as builder } from '@/actions/App/Http/Controllers/Admin/CourseBuilderController';

type Content = {
    id: number;
    type: 'video' | 'textbook';
    title: string;
    description: string | null;
    position: number;
    video_duration_seconds: number | null;
    is_published: boolean;
};

type Material = {
    id: number;
    title: string;
    description: string | null;
    position: number;
    is_published: boolean;
    contents: Content[];
};

type Course = {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    thumbnail_url: string | null;
    banner_url: string | null;
    level: string | null;
    estimated_duration_minutes: number | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    created_at: string | null;
    category: { name: string } | null;
    creator: { name: string } | null;
    teachers: {
        id: number;
        name: string;
        photo_url: string | null;
        expertise: string | null;
    }[];
    materials: Material[];
    statistics: {
        materials: number;
        contents: number;
        videos: number;
        textbooks: number;
        enrollments: number;
    };
};

const statusLabels: Record<Course['status'], string> = {
    draft: 'Draft',
    published: 'Dipublikasikan',
    archived: 'Diarsipkan',
};

const statusClasses: Record<Course['status'], string> = {
    draft: 'border-amber-200 bg-amber-50 text-amber-700',
    published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    archived: 'border-slate-200 bg-slate-100 text-slate-600',
};

const formatDate = (date: string | null): string => {
    if (!date) return '—';

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(date));
};

const formatDuration = (minutes: number | null): string => {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes} menit`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes
        ? `${hours} jam ${remainingMinutes} menit`
        : `${hours} jam`;
};

function StatCard({
    label,
    value,
    icon: Icon,
    tone,
}: {
    label: string;
    value: number;
    icon: typeof BookOpen;
    tone: string;
}) {
    return (
        <Card className="gap-4 py-5 shadow-none">
            <CardContent className="flex items-center gap-4">
                <span
                    className={`grid size-11 place-items-center rounded-xl ${tone}`}
                >
                    <Icon className="size-5" />
                </span>
                <div>
                    <p className="text-muted-foreground text-xs font-medium">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
function ContentRow({ content }: { content: Content }) {
    const isVideo = content.type === 'video';

    return (
        <div className="bg-background flex items-start gap-3 rounded-lg border px-4 py-3">
            <span className="bg-muted text-muted-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-md">
                {isVideo ? (
                    <PlayCircle className="size-4" />
                ) : (
                    <FileText className="size-4" />
                )}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{content.title}</p>
                    <Badge variant="outline" className="text-[11px]">
                        {isVideo ? 'Video' : 'Textbook'}
                    </Badge>
                    {content.is_published ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                        <Badge variant="secondary" className="text-[11px]">
                            Draft
                        </Badge>
                    )}
                </div>
                {content.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {content.description}
                    </p>
                )}
            </div>
            {isVideo && content.video_duration_seconds && (
                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                    <Clock3 className="size-3.5" />
                    {Math.floor(content.video_duration_seconds / 60)} menit
                </span>
            )}
        </div>
    );
}

export default function CourseShow({ course }: { course: Course }) {
    return (
        <>
            <Head title={`Detail: ${course.title}`} />
            <div className="min-h-full space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button variant="ghost" asChild className="-ml-2">
                        <Link href="/admin/courses">
                            <ArrowLeft />
                            Kembali ke kelas
                        </Link>
                    </Button>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={edit(course.id)}>
                                <Pencil />
                                Ubah kelas
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={builder(course.id)}>
                                <Layers3 />
                                Buka builder
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden py-0 shadow-sm">
                    <div className="relative min-h-64 overflow-hidden bg-slate-950 md:min-h-80">
                        {course.banner_url ? (
                            <img
                                src={course.banner_url}
                                alt=""
                                className="absolute inset-0 size-full object-cover opacity-60"
                            />
                        ) : course.thumbnail_url ? (
                            <img
                                src={course.thumbnail_url}
                                alt=""
                                className="absolute inset-0 size-full object-cover opacity-50"
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
                        <div className="relative flex min-h-64 max-w-3xl flex-col justify-end gap-4 p-6 text-white md:min-h-80 md:p-10">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/20">
                                    {course.category?.name ?? 'Tanpa kategori'}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="border-white/30 text-white"
                                >
                                    {statusLabels[course.status]}
                                </Badge>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                                    {course.title}
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
                                    {course.short_description ||
                                        'Belum ada ringkasan kelas.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        label="Modul"
                        value={course.statistics.materials}
                        icon={Layers3}
                        tone="bg-blue-100 text-blue-700"
                    />
                    <StatCard
                        label="Total materi"
                        value={course.statistics.contents}
                        icon={BookOpen}
                        tone="bg-violet-100 text-violet-700"
                    />
                    <StatCard
                        label="Video"
                        value={course.statistics.videos}
                        icon={Video}
                        tone="bg-rose-100 text-rose-700"
                    />
                    <StatCard
                        label="Textbook"
                        value={course.statistics.textbooks}
                        icon={FileText}
                        tone="bg-amber-100 text-amber-700"
                    />
                    <StatCard
                        label="Pendaftar"
                        value={course.statistics.enrollments}
                        icon={Users}
                        tone="bg-emerald-100 text-emerald-700"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="text-primary size-5" />
                                        Kurikulum kelas
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Struktur modul dan materi yang tersedia.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline">
                                    {course.materials.length} modul
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {course.materials.length ? (
                                course.materials.map(
                                    (material, materialIndex) => (
                                        <div
                                            key={material.id}
                                            className="rounded-xl border p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                                                        Modul{' '}
                                                        {materialIndex + 1}
                                                    </p>
                                                    <h2 className="mt-1 font-semibold">
                                                        {material.title}
                                                    </h2>
                                                    {material.description && (
                                                        <p className="text-muted-foreground mt-1 text-sm">
                                                            {
                                                                material.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {
                                                            material.contents
                                                                .length
                                                        }{' '}
                                                        materi
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            material.is_published
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {material.is_published
                                                            ? 'Terbit'
                                                            : 'Draft'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="space-y-2">
                                                {material.contents.length ? (
                                                    material.contents.map(
                                                        (content) => (
                                                            <ContentRow
                                                                key={content.id}
                                                                content={
                                                                    content
                                                                }
                                                            />
                                                        ),
                                                    )
                                                ) : (
                                                    <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                                                        Belum ada materi pada
                                                        modul ini.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )
                            ) : (
                                <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
                                    Belum ada modul pembelajaran.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="text-primary size-5" />
                                    Informasi kelas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={statusClasses[course.status]}
                                    >
                                        {statusLabels[course.status]}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Level
                                    </span>
                                    <span className="font-medium">
                                        {course.level || '—'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Durasi
                                    </span>
                                    <span className="font-medium">
                                        {formatDuration(
                                            course.estimated_duration_minutes,
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Dipublikasikan
                                    </span>
                                    <span className="text-right font-medium">
                                        {formatDate(course.published_at)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">
                                        Dibuat
                                    </span>
                                    <span className="text-right font-medium">
                                        {formatDate(course.created_at)}
                                    </span>
                                </div>
                                {course.description && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-muted-foreground mb-2">
                                                Deskripsi
                                            </p>
                                            <p className="leading-6">
                                                {course.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="text-primary size-5" />
                                    Pengajar
                                </CardTitle>
                                <CardDescription>
                                    Pengajar yang terhubung dengan kelas ini.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {course.teachers.length ? (
                                    course.teachers.map((teacher) => (
                                        <div
                                            key={teacher.id}
                                            className="flex items-center gap-3"
                                        >
                                            {teacher.photo_url ? (
                                                <img
                                                    src={teacher.photo_url}
                                                    alt=""
                                                    className="size-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-full font-semibold">
                                                    {teacher.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate font-medium">
                                                    {teacher.name}
                                                </p>
                                                <p className="text-muted-foreground truncate text-xs">
                                                    {teacher.expertise ||
                                                        'Pengajar kelas'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        Belum ada pengajar yang ditambahkan.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
