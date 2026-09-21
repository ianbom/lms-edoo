import { Head } from '@inertiajs/react';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    EbookCategoryDialog,
    type EbookCategory,
} from '@/components/admin/ebook-category-dialog';
import { DeleteEbookCategoryDialog } from '@/components/admin/delete-ebook-category-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/admin/ebook-categories';
import type { BreadcrumbItem } from '@/types';

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(value),
    );

export default function EbookCategoriesIndex({
    categories,
}: {
    categories: EbookCategory[];
}) {
    const [selected, setSelected] = useState<EbookCategory | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleting, setDeleting] = useState<EbookCategory | null>(null);

    const openForm = (category: EbookCategory | null): void => {
        setSelected(category);
        setFormOpen(true);
    };

    return (
        <>
            <Head title="Ebook Categories" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Ebook Categories
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Organize ebooks into clear library topics.
                        </p>
                    </div>
                    <Button onClick={() => openForm(null)}>
                        <Plus />
                        Tambah kategori
                    </Button>
                </div>

                <div className="bg-card overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="px-5 py-3 font-bold">
                                        Kategori
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Slug
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        E-book
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Urutan
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
                                {categories.map((category, categoryIndex) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="text-muted-foreground px-5 py-4">
                                            {categoryIndex + 1}
                                        </td>
                                        <td className="max-w-md px-5 py-4">
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {category.name}
                                                </p>
                                                {category.description && (
                                                    <p className="text-muted-foreground mt-1 line-clamp-1">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4 font-mono text-xs">
                                            {category.slug}
                                        </td>
                                        <td className="px-5 py-4">
                                            {category.ebooks_count}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge
                                                variant={
                                                    category.is_active
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                            >
                                                {category.is_active
                                                    ? 'Aktif'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4">
                                            {category.position}
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {formatDate(category.updated_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openForm(category)
                                                    }
                                                >
                                                    <Pencil />
                                                    Ubah
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleting(category)
                                                    }
                                                    disabled={
                                                        category.ebooks_count >
                                                        0
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

                    {categories.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <BookOpen className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada kategori e-book
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Buat kategori sebelum menambahkan e-book.
                            </p>
                            <Button
                                className="mt-5"
                                onClick={() => openForm(null)}
                            >
                                <Plus />
                                Tambah kategori
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {formOpen && (
                <EbookCategoryDialog
                    category={selected}
                    open={formOpen}
                    onOpenChange={setFormOpen}
                />
            )}
            <DeleteEbookCategoryDialog
                category={deleting}
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

EbookCategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Ebook Categories',
            href: index(),
        },
    ] satisfies BreadcrumbItem[],
};
