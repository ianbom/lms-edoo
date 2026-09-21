import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    FileCheck2,
    FileText,
    MonitorPlay,
    UserRound,
} from 'lucide-react';

type Enrollment = {
    id: number;
    title: string;
    slug: string;
    thumbnail_url: string | null;
    short_description: string | null;
    category: string | null;
    teacher: string | null;
    materials_count: number;
    status: 'enrolled' | 'in_progress' | 'completed';
    progress: number;
    last_learning_content: string | null;
};

type DashboardProps = {
    stats: { enrolled: number; active: number; completed: number; progress: number };
    recentActivities: { type: 'completed' | 'in_progress'; title: string; subtitle: string; time: string | null }[];
    enrollments: Enrollment[];
    ebooks: {
        id: number; title: string; slug: string; author: string | null;
        short_description: string | null; cover_url: string | null; file_url: string;
        total_pages: number | null; category: string | null;
    }[];
};

function Title({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[18px] font-extrabold tracking-[-.45px] text-[#111b5d]">{children}</h2>
            <Link href={href} className="flex items-center gap-1 text-[11px] font-medium text-[#0961d8]">
                Lihat Semua <ArrowRight size={14} />
            </Link>
        </div>
    );
}

function Progress({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dcecff]">
                <div className="h-full rounded-full bg-[#1167e8]" style={{ width: `${Math.min(100, value)}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-[#1262d7]">{Math.round(value)}%</span>
        </div>
    );
}

function EmptyState({ children }: { children: string }) {
    return <div className="rounded-xl border border-dashed border-[#cddcf0] bg-white px-5 py-10 text-center text-sm text-[#6b7f9f]">{children}</div>;
}

export default function StudentDashboard({
    stats,
    recentActivities,
    enrollments,
    ebooks,
}: DashboardProps) {
    const { auth } = usePage<{ auth: { user?: { name?: string } } }>().props;
    const studentName = auth.user?.name ?? 'Siswa';
    const continueCourses = enrollments.filter((course) => course.status !== 'completed').slice(0, 2);
    const statCards = [
        { label: 'Kelas Saya', value: stats.enrolled, detail: 'Total kelas yang diikuti', icon: MonitorPlay },
        { label: 'Sedang Dipelajari', value: stats.active, detail: 'Kelas dalam proses', icon: Clock3 },
        { label: 'Kelas Selesai', value: stats.completed, detail: 'Kelas yang telah diselesaikan', icon: FileCheck2 },
    ];

    return (
        <>
            <Head title="Dasbor Siswa" />
            <div className="min-w-0 overflow-x-hidden px-4 pb-6 sm:px-7 lg:px-7">
                <section className="pt-5">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-[#1262d7] uppercase">Dasbor Belajar</p>
                    <h1 className="mt-1 break-words text-2xl font-extrabold tracking-[-0.7px] text-[#10195b] sm:text-[28px]">Selamat datang, {studentName}!</h1>
                    <p className="mt-1 text-sm text-[#526b9d]">Siap melanjutkan perjalanan belajarmu hari ini?</p>
                </section>

                <section className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
                    {statCards.map(({ label, value, detail, icon: Icon }) => (
                        <article key={label} className="rounded-xl border border-[#dce8f6] bg-white p-4 shadow-[0_4px_16px_rgba(35,80,135,.04)]">
                            <div className="flex items-center justify-between"><span className="text-xs text-[#6279a5]">{label}</span><Icon size={18} className="text-[#1262d7]" /></div>
                            <p className="mt-2 text-2xl font-extrabold text-[#111c5b]">{value}</p>
                            <p className="mt-1 text-xs text-[#7183a2]">{detail}</p>
                        </article>
                    ))}
                </section>

                <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(330px,1fr)]">
                    <div className="min-w-0">
                        <Title href="/student/classes">Lanjutkan Belajar</Title>
                        {continueCourses.length ? (
                            <div className="grid gap-3 md:grid-cols-2">
                                {continueCourses.map((course) => (
                                    <article key={course.id} className="grid min-h-0 grid-cols-1 overflow-hidden rounded-xl border border-[#dce8f6] bg-white p-3 shadow-[0_4px_16px_rgba(35,80,135,.04)] sm:min-h-[194px] sm:grid-cols-[46%_1fr]">
                                        <img src={course.thumbnail_url ?? '/course-placeholder.svg'} className="aspect-video h-auto min-h-0 w-full rounded-lg object-cover sm:h-full sm:min-h-[168px] sm:aspect-auto" alt="" />
                                        <div className="flex min-w-0 flex-col pt-3 sm:pl-3 sm:pt-0">
                                            <span className="w-fit rounded-md bg-[#e5f2ff] px-2 py-1 text-[10px] text-[#1262d7]">{course.category ?? 'Kelas online'}</span>
                                            <h3 className="mt-1 text-[14px] leading-[1.15] font-extrabold text-[#10195b]">{course.title}</h3>
                                            <p className="mt-2 flex min-w-0 items-center gap-2 truncate text-xs text-[#526b9d]"><UserRound size={13} className="shrink-0" />{course.teacher ?? 'Instruktur belum tersedia'}</p>
                                            <p className="mt-2 flex items-center gap-2 text-xs text-[#526b9d]"><BookOpen size={13} />{course.materials_count} materi</p>
                                            <div className="mt-3"><Progress value={course.progress} /></div>
                                            <p className="mt-3 line-clamp-1 text-[11px] text-[#6279a5]">Materi terakhir: {course.last_learning_content ?? 'Belum dimulai'}</p>
                                            <Link href={`/student/classes/${course.slug}/study`} className="mt-auto flex h-8 items-center justify-center gap-2 rounded-md bg-[#1167e8] text-xs font-semibold text-white">Lanjutkan <ArrowRight size={14} /></Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : <EmptyState>Belum ada kelas yang sedang dipelajari.</EmptyState>}
                    </div>
                    <div className="min-w-0">
                        <Title href="/student/classes">Aktivitas Terbaru</Title>
                        {recentActivities.length ? <div className="divide-y divide-[#e8eff8] rounded-xl border border-[#dce8f6] bg-white px-4">{recentActivities.map((item, index) => (
                            <div key={`${item.title}-${index}`} className="flex items-start gap-3 py-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f3ff] text-[#1262d7]">{item.type === 'completed' ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}</span><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#17235f]">{item.title}</p><p className="truncate text-xs text-[#7183a2]">{item.subtitle}</p></div><span className="max-w-20 shrink-0 text-right text-[11px] leading-tight text-[#7183a2] sm:max-w-none">{item.time}</span></div>
                        ))}</div> : <EmptyState>Belum ada aktivitas belajar.</EmptyState>}
                    </div>
                </section>

                <section className="mt-5">
                    <Title href="/student/ebooks">E-Book untuk Anda</Title>
                    {ebooks.length ? <div className="grid gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3">{ebooks.map((ebook) => <a key={ebook.id} href={ebook.file_url} target="_blank" rel="noreferrer" className="flex min-w-0 gap-3 rounded-xl border border-[#dce8f6] bg-white p-3"><div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#e8f3ff] text-[#1262d7]">{ebook.cover_url ? <img src={ebook.cover_url} className="size-full object-cover" alt="" /> : <BookOpen size={25} />}</div><div className="min-w-0"><h3 className="line-clamp-2 text-sm font-bold text-[#10195b]">{ebook.title}</h3><p className="mt-1 truncate text-xs text-[#526b9d]">{ebook.author ?? 'Penulis belum tersedia'}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#7183a2]"><FileText size={12} />{ebook.total_pages ? `${ebook.total_pages} halaman` : 'E-book PDF'}</p></div></a>)}</div> : <EmptyState>Belum ada e-book tersedia.</EmptyState>}
                </section>
            </div>
        </>
    );
}
