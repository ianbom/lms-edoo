import { Head } from '@inertiajs/react';
import { BookOpen, ExternalLink, FileText, LibraryBig } from 'lucide-react';

type Ebook = {
    id: number;
    title: string;
    slug: string;
    author: string | null;
    short_description: string | null;
    cover_url: string | null;
    file_url: string;
    total_pages: number | null;
    category: string | null;
};

export default function Ebooks({ ebooks }: { ebooks: Ebook[] }) {
    return (
        <>
            <Head title="E-Books" />

            <section className="px-5 pb-10 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.9px] text-[#071842] sm:text-[36px]">
                                E-Books
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#627395] sm:text-base">
                                Jelajahi koleksi bacaan untuk mendukung proses
                                belajarmu.
                            </p>
                        </div>

                    </div>

                    {ebooks.length > 0 ? (
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {ebooks.map((ebook) => (
                                <a
                                    key={ebook.id}
                                    href={ebook.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group hover:border-primary/35 focus-visible:ring-primary/30 overflow-hidden rounded-2xl border border-[#dce7f5] bg-white shadow-[0_7px_20px_rgba(24,71,132,.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(17,103,232,.14)] focus-visible:ring-3 focus-visible:outline-none"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eaf3ff]">
                                        {ebook.cover_url ? (
                                            <img
                                                src={ebook.cover_url}
                                                alt={`Cover ${ebook.title}`}
                                                className="size-full object-cover transition duration-300 group-hover:scale-105"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        '/course-placeholder.svg';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-primary flex size-full flex-col items-center justify-center gap-3">
                                                <BookOpen size={44} />
                                                <span className="text-xs font-bold">
                                                    E-Book
                                                </span>
                                            </div>
                                        )}
                                        {ebook.category && (
                                            <span className="text-primary absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold shadow-sm">
                                                {ebook.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h2 className="group-hover:text-primary line-clamp-2 text-[17px] leading-6 font-extrabold text-[#10245d]">
                                            {ebook.title}
                                        </h2>
                                        <p className="mt-1 text-xs text-[#7183a2]">
                                            {ebook.author ||
                                                'Penulis belum tersedia'}
                                        </p>
                                        {ebook.short_description && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#5d7195]">
                                                {ebook.short_description}
                                            </p>
                                        )}
                                        <div className="mt-5 flex items-center justify-between border-t border-[#e6edf7] pt-4">
                                            <span className="flex items-center gap-1.5 text-xs text-[#6b7f9f]">
                                                <FileText size={15} />
                                                {ebook.total_pages
                                                    ? `${ebook.total_pages} halaman`
                                                    : 'E-book PDF'}
                                            </span>
                                            <span className="text-primary flex items-center gap-1 text-xs font-bold">
                                                Baca <ExternalLink size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cddcf0] bg-white px-6 text-center">
                            <span className="text-primary grid size-14 place-items-center rounded-full bg-[#e8f3ff]">
                                <BookOpen size={28} />
                            </span>
                            <h2 className="mt-5 text-xl font-extrabold text-[#10245d]">
                                Belum ada e-book
                            </h2>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-[#64789b]">
                                Koleksi e-book akan muncul di sini setelah
                                tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
