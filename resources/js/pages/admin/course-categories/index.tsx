import { Head } from '@inertiajs/react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CourseCategoryDialog } from '@/components/admin/course-category-dialog';
import { DeleteCourseCategoryDialog } from '@/components/admin/delete-course-category-dialog';
import { Button } from '@/components/ui/button';
import { index as courseCategories } from '@/routes/admin/course-categories';
import type { BreadcrumbItem } from '@/types';

type CourseCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    courses_count: number;
    updated_at: string;
};

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(value),
    );

export default function CourseCategoriesIndex({
    categories,
}: {
    categories: CourseCategory[];
}) {
    const [formCategory, setFormCategory] = useState<CourseCategory | null>(
        null,
    );
    const [formOpen, setFormOpen] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState<CourseCategory | null>(
        null,
    );

    const openCreateDialog = (): void => {
        setFormCategory(null);
        setFormOpen(true);
    };

    const openEditDialog = (category: CourseCategory): void => {
        setFormCategory(category);
        setFormOpen(true);
    };

    return (
        <>
            <Head title="Kategori Kelas" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kategori Kelas
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelompokkan kelas ke topik belajar yang rapi.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus />
                        Tambah kategori
                    </Button>
                </div>

                <div className="bg-card overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175 text-left text-sm">
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
                                        Kelas
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
                                            <p className="font-medium">
                                                {category.name}
                                            </p>
                                            {category.description && (
                                                <p className="text-muted-foreground mt-1 line-clamp-1">
                                                    {category.description}
                                                </p>
                                            )}
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4 font-mono text-xs">
                                            {category.slug}
                                        </td>
                                        <td className="px-5 py-4">
                                            {category.courses_count}
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
                                                        openEditDialog(category)
                                                    }
                                                >
                                                    <Pencil />
                                                    Ubah
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteCategory(
                                                            category,
                                                        )
                                                    }
                                                    disabled={
                                                        category.courses_count >
                                                        0
                                                    }
                                                    title={
                                                        category.courses_count >
                                                        0
                                                            ? 'Move or delete its courses before deleting this category.'
                                                            : undefined
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
                            <Tags className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada kategori kelas
                            </h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Buat kategori pertama sebelum menambahkan
                                kelas.
                            </p>
                            <Button className="mt-5" onClick={openCreateDialog}>
                                <Plus />
                                Tambah kategori
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {formOpen && (
                <CourseCategoryDialog
                    category={formCategory}
                    open={formOpen}
                    onOpenChange={setFormOpen}
                />
            )}
            <DeleteCourseCategoryDialog
                category={deleteCategory}
                open={deleteCategory !== null}
                onOpenChange={(open) => !open && setDeleteCategory(null)}
            />
        </>
    );
}

CourseCategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kategori Kelas',
            href: courseCategories(),
        },
    ] satisfies BreadcrumbItem[],
};
