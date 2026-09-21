import { Head, router } from '@inertiajs/react';
import { Layers3, Pencil, Plus, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CourseMaterialDialog } from '@/components/admin/course-material-dialog';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
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
import { index } from '@/routes/admin/course-materials';

type Material = {
    id: number;
    course_id: number;
    title: string;
    description: string | null;
    position: number;
    is_published: boolean;
    contents_count: number;
    course: { title: string };
};
type Course = { id: number; title: string };
type Pagination = {
    data: Material[];
    current_page: number;
    last_page: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
type Filters = { search?: string; course_id?: number; per_page?: number };

export default function CourseMaterialsIndex({
    materials,
    courses,
    filters,
}: {
    materials: Pagination;
    courses: Course[];
    filters: Filters;
}) {
    const [query, setQuery] = useState({
        search: filters.search ?? '',
        course_id: String(filters.course_id ?? ''),
        per_page: String(filters.per_page ?? 15),
    });
    const debouncedQuery = useDebouncedValue(query);
    const didMount = useRef(false);
    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        router.get(index.url(), { ...debouncedQuery, page: 1 }, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedQuery]);
    const [selected, setSelected] = useState<Material | null>(null);
    const [open, setOpen] = useState(false);
    const openForm = (material: Material | null) => {
        setSelected(material);
        setOpen(true);
    };
    const setFormOpen = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) setSelected(null);
    };
    const visitPage = (page: number): void => {
        router.get(
            index.url(),
            { ...query, page },
            { preserveState: true, replace: true },
        );
    };
    const clearFilters = () => {
        const empty = { search: '', course_id: '', per_page: '15' };
        setQuery(empty);
    };
    const pages = Array.from(
        { length: materials.last_page },
        (_, pageIndex) => pageIndex + 1,
    );
    const hasFilters = Boolean(query.search || query.course_id);

    return (
        <>
            <Head title="Modul Kelas" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            Kurikulum
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Modul Kelas
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola modul yang menyusun setiap kelas.
                        </p>
                    </div>
                    <Button onClick={() => openForm(null)}>
                        <Plus /> Tambah modul
                    </Button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
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
                            placeholder="Cari modul atau kelas"
                        />
                    </div>
                    <Select
                        value={query.course_id || 'all'}
                        onValueChange={(value) =>
                            setQuery({
                                ...query,
                                course_id: value === 'all' ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-56">
                            <SelectValue placeholder="Semua kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua kelas</SelectItem>
                            {courses.map((course) => (
                                <SelectItem
                                    key={course.id}
                                    value={String(course.id)}
                                >
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasFilters && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                        >
                            <X />
                            Bersihkan
                        </Button>
                    )}
                </div>
                <div className="bg-card overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="font-bold">Modul</th>
                                    <th className="font-bold">Kelas</th>
                                    <th className="font-bold">Materi</th>
                                    <th className="font-bold">Status</th>
                                    <th className="font-bold">Urutan</th>
                                    <th className="text-right font-bold">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {materials.data.map(
                                    (material, materialIndex) => (
                                        <tr key={material.id}>
                                            <td className="text-muted-foreground px-5 py-4">
                                                {(materials.current_page - 1) *
                                                    materials.per_page +
                                                    materialIndex +
                                                    1}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                                                        <Layers3 className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {material.title}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {material.description ||
                                                                'Belum ada deskripsi'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{material.course.title}</td>
                                            <td>{material.contents_count}</td>
                                            <td>
                                                <Badge
                                                    variant={
                                                        material.is_published
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {material.is_published
                                                        ? 'Dipublikasikan'
                                                        : 'Draf'}
                                                </Badge>
                                            </td>
                                            <td>{material.position}</td>
                                            <td className="px-5 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openForm(material)
                                                    }
                                                >
                                                    <Pencil /> Ubah
                                                </Button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                    {materials.data.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <Layers3 className="text-muted-foreground mx-auto size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada modul kelas.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Tambah modul atau ubah kata pencarian.
                            </p>
                        </div>
                    )}
                    {(materials.last_page > 1 || materials.data.length > 0) && (
                        <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-end sm:justify-between">
                            <span className="text-muted-foreground">
                                Halaman {materials.current_page} dari{' '}
                                {materials.last_page}
                            </span>
                            <div className="flex flex-col items-start gap-2 sm:items-end">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!materials.prev_page_url}
                                        onClick={() =>
                                            visitPage(
                                                materials.current_page - 1,
                                            )
                                        }
                                    >
                                        Sebelumnya
                                    </Button>
                                    {pages.map((page) => (
                                        <Button
                                            key={page}
                                            type="button"
                                            variant={
                                                page === materials.current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => visitPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!materials.next_page_url}
                                        onClick={() =>
                                            visitPage(
                                                materials.current_page + 1,
                                            )
                                        }
                                    >
                                        Berikutnya
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-xs">
                                        Per halaman
                                    </span>
                                    <Select
                                        value={query.per_page}
                                        onValueChange={(value) => {
                                            const nextQuery = {
                                                ...query,
                                                per_page: value,
                                            };
                                            setQuery(nextQuery);
                                            router.get(
                                                index.url(),
                                                { ...nextQuery, page: 1 },
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[10, 15, 25].map((value) => (
                                                <SelectItem
                                                    key={value}
                                                    value={String(value)}
                                                >
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {open && (
                <CourseMaterialDialog
                    material={selected}
                    courses={courses}
                    open={open}
                    onOpenChange={setFormOpen}
                />
            )}
        </>
    );
}
