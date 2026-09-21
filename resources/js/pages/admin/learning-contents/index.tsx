import { Head, router } from '@inertiajs/react';
import { FileText, Pencil, Plus, Search, Video, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LearningContentDialog } from '@/components/admin/learning-content-dialog';
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
import { index } from '@/routes/admin/learning-contents';

type MaterialOption = { id: number; title: string; course: { id: number; title: string } };
type CourseOption = { id: number; title: string };
type Content = {
    id: number;
    course_material_id: number;
    type: 'video' | 'textbook';
    title: string;
    description: string | null;
    position: number;
    youtube_url: string | null;
    textbook_content: string | null;
    attachment_url: string | null;
    is_published: boolean;
    material: { title: string; course: { title: string } };
};
type Pagination = {
    data: Content[];
    current_page: number;
    last_page: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
type Filters = {
    search?: string;
    course_id?: number;
    course_material_id?: number;
    per_page?: number;
};

export default function LearningContentsIndex({
    contents,
    courses,
    materials,
    filters,
}: {
    contents: Pagination;
    courses: CourseOption[];
    materials: MaterialOption[];
    filters: Filters;
}) {
    const [query, setQuery] = useState({
        search: filters.search ?? '',
        course_id: String(filters.course_id ?? ''),
        course_material_id: String(filters.course_material_id ?? ''),
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
    const [selected, setSelected] = useState<Content | null>(null);
    const [open, setOpen] = useState(false);
    const openForm = (content: Content | null) => {
        setSelected(content);
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
    const clearFilters = (): void => {
        const empty = {
            search: '',
            course_id: '',
            course_material_id: '',
            per_page: '15',
        };
        setQuery(empty);
    };
    const availableMaterials = query.course_id
        ? materials.filter(
              (material) => material.course.id === Number(query.course_id),
          )
        : materials;
    const pages = Array.from(
        { length: contents.last_page },
        (_, pageIndex) => pageIndex + 1,
    );

    return (
        <>
            <Head title="Materi Pembelajaran" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            Kurikulum
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Materi Pembelajaran
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola video pembelajaran dan bab bacaan.
                        </p>
                    </div>
                    <Button onClick={() => openForm(null)}>
                        <Plus /> Tambah materi
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
                            placeholder="Cari materi, modul, atau kelas"
                        />
                    </div>
                    <Select
                        value={query.course_id || 'all'}
                        onValueChange={(value) =>
                            setQuery({
                                ...query,
                                course_id: value === 'all' ? '' : value,
                                course_material_id: '',
                            })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-52">
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
                    <Select
                        value={query.course_material_id || 'all'}
                        onValueChange={(value) =>
                            setQuery({
                                ...query,
                                course_material_id:
                                    value === 'all' ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-56">
                            <SelectValue placeholder="Semua modul" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua modul</SelectItem>
                            {availableMaterials.map((material) => (
                                <SelectItem
                                    key={material.id}
                                    value={String(material.id)}
                                >
                                    {material.course.title} · {material.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(query.search ||
                        query.course_id ||
                        query.course_material_id ||
                        query.per_page !== '15') && (
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
                        <table className="w-full min-w-220 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="font-bold">Materi</th>
                                    <th className="font-bold">Kelas / Modul</th>
                                    <th className="font-bold">Jenis</th>
                                    <th className="font-bold">Status</th>
                                    <th className="font-bold">Urutan</th>
                                    <th className="text-right font-bold">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {contents.data.map((content, contentIndex) => (
                                    <tr key={content.id}>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {(contents.current_page - 1) *
                                                contents.per_page +
                                                contentIndex +
                                                1}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary rounded-lg p-2">
                                                    {content.type ===
                                                    'video' ? (
                                                        <Video className="size-4" />
                                                    ) : (
                                                        <FileText className="size-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {content.title}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {content.description ||
                                                            'Belum ada deskripsi'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p>
                                                {content.material.course.title}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {content.material.title}
                                            </p>
                                        </td>
                                        <td className="capitalize">
                                            {content.type}
                                        </td>
                                        <td>
                                            <Badge
                                                variant={
                                                    content.is_published
                                                        ? 'secondary'
                                                        : 'outline'
                                                }
                                            >
                                                {content.is_published
                                                    ? 'Dipublikasikan'
                                                    : 'Draf'}
                                            </Badge>
                                        </td>
                                        <td>{content.position}</td>
                                        <td className="px-5 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    openForm(content)
                                                }
                                            >
                                                <Pencil /> Ubah
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {contents.data.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <FileText className="text-muted-foreground mx-auto size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada materi pembelajaran.
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Tambah materi atau ubah kata pencarian.
                            </p>
                        </div>
                    )}
                    {(contents.last_page > 1 || contents.data.length > 0) && (
                        <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-end sm:justify-between">
                            <span className="text-muted-foreground">
                                Halaman {contents.current_page} dari{' '}
                                {contents.last_page}
                            </span>
                            <div className="flex flex-col items-start gap-2 sm:items-end">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!contents.prev_page_url}
                                        onClick={() =>
                                            visitPage(contents.current_page - 1)
                                        }
                                    >
                                        Sebelumnya
                                    </Button>
                                    {pages.map((page) => (
                                        <Button
                                            key={page}
                                            type="button"
                                            variant={
                                                page === contents.current_page
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
                                        disabled={!contents.next_page_url}
                                        onClick={() =>
                                            visitPage(contents.current_page + 1)
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
                <LearningContentDialog
                    content={selected}
                    materials={materials}
                    open={open}
                    onOpenChange={setFormOpen}
                />
            )}
        </>
    );
}
