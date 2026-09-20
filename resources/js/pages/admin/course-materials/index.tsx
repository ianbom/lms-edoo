import { Head, Link, router } from '@inertiajs/react';
import { Layers3, Pencil, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { CourseMaterialDialog } from '@/components/admin/course-material-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
type Filters = { search?: string };

export default function CourseMaterialsIndex({
    materials,
    courses,
    filters,
}: {
    materials: Pagination;
    courses: Course[];
    filters: Filters;
}) {
    const [query, setQuery] = useState({ search: filters.search ?? '' });
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
    const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(index.url(), query, { preserveState: true, replace: true });
    };
    const clearFilters = () => {
        const empty = { search: '' };
        setQuery(empty);
        router.get(index.url(), empty, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Course Materials" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            Curriculum
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Course Materials
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage the modules that structure each course.
                        </p>
                    </div>
                    <Button onClick={() => openForm(null)}>
                        <Plus /> Add material
                    </Button>
                </div>
                <form
                    className="flex flex-col gap-3 sm:flex-row"
                    onSubmit={applyFilters}
                >
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            value={query.search}
                            onChange={(event) =>
                                setQuery({ search: event.target.value })
                            }
                            className="pl-9"
                            placeholder="Search materials or courses"
                        />
                    </div>
                    <Button type="submit">Filter</Button>
                    {query.search && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                        >
                            <X />
                            Clear
                        </Button>
                    )}
                </form>
                <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 text-left text-sm">
                            <thead className="bg-muted/40 border-b">
                                <tr>
                                    <th className="px-5 py-3">No.</th>
                                    <th>Material</th>
                                    <th>Course</th>
                                    <th>Contents</th>
                                    <th>Status</th>
                                    <th>Position</th>
                                    <th className="text-right">Action</th>
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
                                                                'No description'}
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
                                                        ? 'Published'
                                                        : 'Draft'}
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
                                                    <Pencil /> Edit
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
                                No course materials found
                            </h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Create a material or change the current search.
                            </p>
                        </div>
                    )}
                    {materials.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
                            <span className="text-muted-foreground">
                                Page {materials.current_page} of{' '}
                                {materials.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    disabled={!materials.prev_page_url}
                                >
                                    <Link href={materials.prev_page_url ?? '#'}>
                                        Previous
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    disabled={!materials.next_page_url}
                                >
                                    <Link href={materials.next_page_url ?? '#'}>
                                        Next
                                    </Link>
                                </Button>
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
