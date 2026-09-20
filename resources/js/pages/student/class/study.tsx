import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Circle, Clock3, FileText, Menu, PlayCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Progress = { status: 'not_started' | 'in_progress' | 'completed'; progress_percentage: number };
type Content = { id: number; title: string; type: 'video' | 'textbook'; description: string | null; youtube_video_id: string | null; video_duration_seconds: number | null; textbook_content: string | null; attachment_url: string | null; progress: Progress };
type Material = { id: number; title: string; description: string | null; progress: Progress; contents: Content[] };
type StudyProps = { course: { id: number; title: string; slug: string; thumbnail_url: string | null }; enrollment: Progress; selectedContent: Content | null; materials: Material[] };

const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '—';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const studyUrl = (course: string, content?: number): string => `/student/classes/${course}/study${content ? `/${content}` : ''}`;

function Curriculum({ course, enrollment, materials, selectedContent, onNavigate }: { course: StudyProps['course']; enrollment: Progress; materials: Material[]; selectedContent: Content | null; onNavigate?: () => void }) {
    const contents = materials.flatMap((material) => material.contents);
    const completed = contents.filter((content) => content.progress.status === 'completed').length;
    const progress = Math.round(enrollment.progress_percentage);

    return (
        <div className="flex h-full min-h-0 flex-col bg-white">
            <div className="border-b border-[#e3eaf5] px-7 pt-8 pb-5">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-[22px] leading-none font-extrabold tracking-[-0.55px] text-[#071842]">Kurikulum Kelas</h2>
                        <p className="mt-3 text-sm text-[#617394]">{progress}% Selesai</p>
                    </div>
                    <span className="text-sm font-extrabold text-primary">{completed}/{contents.length}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf2f8]">
                    <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-1">
                {materials.map((material, materialIndex) => (
                    <section key={material.id} className="border-b border-[#edf1f7] py-5 last:border-b-0">
                        <p className="px-2 text-[12px] leading-[1.35] font-extrabold tracking-[0.035em] text-[#91a1bf] uppercase">
                            Modul {materialIndex + 1}: {material.title}
                        </p>
                        <div className="mt-4 space-y-2">
                            {material.contents.map((content) => {
                                const active = content.id === selectedContent?.id;
                                const complete = content.progress.status === 'completed';

                                return (
                                    <Link
                                        key={content.id}
                                        href={studyUrl(course.slug, content.id)}
                                        onClick={onNavigate}
                                        className={`flex min-h-20 items-start gap-3 rounded-2xl px-4 py-4 transition ${active ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(17,103,232,.22)]' : 'text-[#273b64] hover:bg-[#f3f7fc]'}`}
                                    >
                                        <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${active ? 'bg-white/18 text-white' : complete ? 'bg-[#e7f2ff] text-primary' : 'border-2 border-[#d2ddeb] text-[#9aabc5]'}`}>
                                            {complete ? <CheckCircle2 size={17} /> : content.type === 'video' ? <PlayCircle size={17} /> : <FileText size={16} />}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[14px] leading-5 font-bold">{content.title}</span>
                                            <span className={`mt-2 flex items-center gap-1.5 text-xs ${active ? 'text-white/75' : 'text-[#91a0ba]'}`}>
                                                {content.type === 'video' ? <><Clock3 size={14} />{formatDuration(content.video_duration_seconds)}</> : 'Materi bacaan'}
                                            </span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {materials.length === 0 && (
                    <div className="px-5 py-16 text-center text-sm text-[#64789b]">Materi belum tersedia.</div>
                )}
            </div>

            <div className="border-t border-[#e3eaf5] bg-[#f8faff] px-6 py-5">
                <p className="text-[11px] font-extrabold tracking-[0.035em] text-[#91a1bf] uppercase">Progress Pembelajaran</p>
                <div className="mt-3 flex items-center gap-3 text-sm text-[#536889]">
                    <span className={`grid size-5 place-items-center rounded-full border ${completed === contents.length && contents.length > 0 ? 'border-primary bg-primary text-white' : 'border-[#cbd7e7]'}`}>
                        {completed === contents.length && contents.length > 0 && <CheckCircle2 size={13} />}
                    </span>
                    <span>Materi selesai: <strong className="text-[#132852]">{completed}/{contents.length}</strong></span>
                </div>
            </div>
        </div>
    );
}

export default function Study({ course, enrollment, selectedContent, materials }: StudyProps) {
    const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const selectedMaterial = materials.find((material) => material.contents.some((content) => content.id === selectedContent?.id));

    const complete = () => {
        if (!selectedContent || selectedContent.progress.status === 'completed') return;
        setCompleting(true);
        router.post(`${studyUrl(course.slug, selectedContent.id)}/complete`, {}, { preserveScroll: true, onFinish: () => setCompleting(false) });
    };

    return (
        <>
            <Head title={`${course.title} · Belajar`} />
            <div className="min-h-screen bg-[#fbfcfe] xl:grid xl:grid-cols-[minmax(0,1fr)_420px]">
                <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 xl:px-10 xl:py-14 2xl:px-12">
                    {selectedContent ? (
                        <div className="mx-auto w-full max-w-6xl">
                            <div className="mb-8 flex items-start gap-5">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-3 text-[13px] font-extrabold tracking-[0.04em] text-primary uppercase">{selectedMaterial?.title || course.title}</p>
                                    <h1 className="max-w-4xl text-[30px] leading-[1.12] font-extrabold tracking-[-1.25px] text-[#071842] sm:text-[38px] lg:text-[42px]">
                                        {selectedContent.title}
                                    </h1>
                                    {selectedContent.description && <p className="mt-3 text-[18px] leading-7 text-[#627395]">{selectedContent.description}</p>}
                                </div>
                                <Button
                                    type="button"
                                    onClick={complete}
                                    disabled={completing || selectedContent.progress.status === 'completed'}
                                    className="hidden h-auto min-h-18 w-46 shrink-0 rounded-2xl bg-primary px-6 py-4 text-base font-bold whitespace-normal text-primary-foreground shadow-[0_8px_18px_rgba(17,103,232,.22)] hover:bg-[#075ad0] sm:inline-flex"
                                >
                                    <CheckCircle2 size={20} />
                                    <span>{selectedContent.progress.status === 'completed' ? 'Materi Selesai' : completing ? 'Menyimpan...' : selectedContent.type === 'video' ? 'Selesaikan Video' : 'Selesaikan Materi'}</span>
                                </Button>
                            </div>

                            <Button variant="outline" onClick={() => setMobileCurriculumOpen(true)} className="mb-4 border-[#cfdded] text-primary xl:hidden">
                                <Menu /> Materi Kelas
                            </Button>

                            {selectedContent.type === 'video' ? (
                                <div className="aspect-video overflow-hidden rounded-lg bg-[#071842] shadow-[0_22px_42px_rgba(25,54,95,.16)]">
                                    {selectedContent.youtube_video_id ? (
                                        <iframe
                                            className="size-full"
                                            src={`https://www.youtube.com/embed/${encodeURIComponent(selectedContent.youtube_video_id)}?rel=0&modestbranding=1`}
                                            title={selectedContent.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex size-full flex-col items-center justify-center text-white/70">
                                            <PlayCircle size={52} />
                                            <p className="mt-3 text-sm">Video belum tersedia.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <article className="prose prose-slate min-h-96 max-w-none rounded-2xl border border-[#dce5f1] bg-white p-6 text-[#263a63] shadow-[0_16px_36px_rgba(25,54,95,.08)] prose-headings:text-[#071842] prose-a:text-primary sm:p-9" dangerouslySetInnerHTML={{ __html: selectedContent.textbook_content || '<p>Isi materi belum tersedia.</p>' }} />
                            )}

                            <section className="mt-7 rounded-2xl border border-[#dce5f1] bg-white px-5 py-5 shadow-[0_10px_28px_rgba(25,54,95,.06)] sm:px-7">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-extrabold text-[#071842]">Catatan Materi</p>
                                        <p className="mt-1 text-sm text-[#65799a]">Progress kelas saat ini {Math.round(enrollment.progress_percentage)}%.</p>
                                    </div>
                                    {selectedContent.attachment_url && <a href={selectedContent.attachment_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:text-[#0754c9]">Buka lampiran</a>}
                                </div>
                                <Button
                                    type="button"
                                    onClick={complete}
                                    disabled={completing || selectedContent.progress.status === 'completed'}
                                    className="mt-5 w-full bg-primary text-primary-foreground hover:bg-[#075ad0] sm:hidden"
                                >
                                    <CheckCircle2 />
                                    {selectedContent.progress.status === 'completed' ? 'Materi Selesai' : completing ? 'Menyimpan...' : 'Tandai selesai'}
                                </Button>
                            </section>
                        </div>
                    ) : (
                        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
                            <Circle className="size-12 text-[#9cb6d9]" />
                            <h1 className="mt-4 text-2xl font-extrabold text-[#071842]">Belum ada materi</h1>
                            <p className="mt-2 text-sm text-[#5a73a1]">Materi kelas akan muncul di sini setelah dipublikasikan.</p>
                        </div>
                    )}
                </main>

                <aside className="hidden h-screen min-h-0 border-l-4 border-[#d8e1ef] bg-white xl:sticky xl:top-0 xl:block">
                    <Curriculum course={course} enrollment={enrollment} materials={materials} selectedContent={selectedContent} />
                </aside>
            </div>

            {mobileCurriculumOpen && (
                <div className="fixed inset-0 z-60 xl:hidden">
                    <button type="button" aria-label="Tutup daftar materi" className="absolute inset-0 bg-[#071750]/40" onClick={() => setMobileCurriculumOpen(false)} />
                    <aside className="absolute inset-y-0 right-0 flex w-[min(420px,92vw)] flex-col bg-white shadow-2xl">
                        <div className="flex justify-end border-b border-[#e3eaf5] p-3">
                            <Button variant="ghost" size="icon" onClick={() => setMobileCurriculumOpen(false)} aria-label="Tutup daftar materi"><X /></Button>
                        </div>
                        <div className="min-h-0 flex-1">
                            <Curriculum course={course} enrollment={enrollment} materials={materials} selectedContent={selectedContent} onNavigate={() => setMobileCurriculumOpen(false)} />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
