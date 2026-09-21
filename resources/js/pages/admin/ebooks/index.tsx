import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    EbookDialog,
    formatStatus,
    type Ebook,
    type EbookCategoryOption,
} from '@/components/admin/ebook-dialog';
import { DeleteEbookDialog } from '@/components/admin/delete-ebook-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index } from '@/routes/admin/ebooks';
import type { BreadcrumbItem } from '@/types';

type Pagination = {
    data: Ebook[];
    current_page: number;
    last_page: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Filters = { search: string; category: string; status: string };

const statusVariant = (status: Ebook['status']) =>
    status === 'published' ? 'secondary' : 'outline';

export default function EbooksIndex({
    ebooks,
    categories,
    filters,
    statuses,
}: {
    ebooks: Pagination;
    categories: EbookCategoryOption[];
    filters: Filters;
    statuses: string[];
}) {
    const [query, setQuery] = useState(filters);
    const [selected, setSelected] = useState<Ebook | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleting, setDeleting] = useState<Ebook | null>(null);

    const applyFilters = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        router.get(index.url(), query, { preserveState: true, replace: true });
    };

    const clearFilters = (): void => {
        const empty = { search: '', category: '', status: '' };
        setQuery(empty);
        router.get(index.url(), empty, { preserveState: true, replace: true });
    };

    const openForm = (ebook: Ebook | null): void => {
        setSelected(ebook);
        setFormOpen(true);
    };

    return (
        <>
            <Head title='E-book' />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            E-book
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola sumber belajar yang bisa diunduh di perpustakaan.
                        </p>
                    </div>
                    <Button onClick={() => openForm(null)}>
                        <Plus />
                        Tambah e-book
                    </Button>
                </div>

                <form
                    className="flex flex-col gap-3 lg:flex-row"
                    onSubmit={applyFilters}
                >
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            value={query.search}
                            onChange={(event) =>
                                setQuery({
                                    ...query,
                                    search: event.target.value,
                                })
                            }
                            className="pl-9"
                            placeholder="Cari judul atau penulis"
                        />
                    </div>
                    <Select
                        value={query.category || undefined}
                        onValueChange={(category) =>
                            setQuery({
                                ...query,
                                category: category === 'all' ? '' : category,
                            })
                        }
                    >
                        <SelectTrigger className="w-full lg:w-52">
                            <SelectValue placeholder='Semua kategori' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua kategori</SelectItem>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={query.status || undefined}
                        onValueChange={(status) =>
                            setQuery({
                                ...query,
                                status: status === 'all' ? '' : status,
                            })
                        }
                    >
                        <SelectTrigger className="w-full lg:w-44">
                            <SelectValue placeholder='Semua status' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua status</SelectItem>
                            {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {formatStatus(status)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit">Terapkan filter</Button>
                    {(query.search || query.category || query.status) && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                        >
                            <X />
                            Bersihkan
                        </Button>
                    )}
                </form>

                <div className="bg-card overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-250 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="px-5 py-3 font-bold">
                                        E-book
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Kategori
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        File
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Diperbarui
                                    </th>
                                    <th className="px-5 py-3 text-right font-bold">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {ebooks.data.map((ebook, ebookIndex) => (
                                    <tr
                                        key={ebook.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="text-muted-foreground px-5 py-4">
                                            {(ebooks.current_page - 1) *
                                                ebooks.per_page +
                                                ebookIndex +
                                                1}
                                        </td>
                                        <td className="max-w-md px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {ebook.cover_url ? (
                                                    <img
                                                        src={ebook.cover_url}
                                                        alt=""
                                                        className="size-10 rounded-lg border object-cover"
                                                    />
                                                ) : (
                                                    <span className="bg-secondary text-secondary-foreground flex size-10 items-center justify-center rounded-lg">
                                                        <BookOpen className="size-5" />
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    {ebook.file_url ? (
                                                        <a
                                                            href={
                                                                ebook.file_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium underline-offset-4 hover:underline"
                                                        >
                                                            {ebook.title}
                                                        </a>
                                                    ) : (
                                                        <p className="font-medium">
                                                            {ebook.title}
                                                        </p>
                                                    )}
                                                    <p className="text-muted-foreground mt-1 text-xs">
                                                        {ebook.author ??
                                                            'Penulis belum tersedia'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {ebook.category.name}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge
                                                variant={statusVariant(
                                                    ebook.status,
                                                )}
                                            >
                                                {formatStatus(ebook.status)}
                                            </Badge>
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {ebook.file_name ?? 'PDF belum tersedia'}
                                            {ebook.total_pages && (
                                                <span className="block text-xs">
                                                    {ebook.total_pages} pages
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {new Intl.DateTimeFormat('id-ID', {
                                                dateStyle: 'medium',
                                            }).format(
                                                new Date(ebook.updated_at),
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openForm(ebook)
                                                    }
                                                >
                                                    <Pencil />
                                                    Ubah
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleting(ebook)
                                                    }
                                                >
                                                    <Trash2 />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {ebooks.data.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <BookOpen className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada e-book
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Tambah e-book or change the current filters.
                            </p>
                            <Button
                                className="mt-5"
                                onClick={() => openForm(null)}
                            >
                                <Plus />
                                Tambah e-book
                            </Button>
                        </div>
                    )}
                    {ebooks.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
                            <span className="text-muted-foreground">
                                Halaman {ebooks.current_page} dari {ebooks.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    disabled={!ebooks.prev_page_url}
                                >
                                    <Link href={ebooks.prev_page_url ?? '#'}>
                                        Sebelumnya
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    disabled={!ebooks.next_page_url}
                                >
                                    <Link href={ebooks.next_page_url ?? '#'}>
                                        Berikutnya
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {formOpen && (
                <EbookDialog
                    ebook={selected}
                    categories={categories}
                    statuses={statuses}
                    open={formOpen}
                    onOpenChange={setFormOpen}
                />
            )}
            <DeleteEbookDialog
                ebook={deleting}
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

EbooksIndex.layout = {
    breadcrumbs: [
        { title: 'E-book', href: index() },
    ] satisfies BreadcrumbItem[],
};
