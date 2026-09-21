import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    create,
    edit,
} from '@/actions/App/Http/Controllers/Admin/CourseController';
import { show as builder } from '@/actions/App/Http/Controllers/Admin/CourseBuilderController';
import { index } from '@/routes/admin/courses';

type Course = {
    id: number;
    title: string;
    thumbnail_url: string | null;
    status: string;
    level: string | null;
    category: { name: string };
    materials_count: number;
    contents_count: number;
    teachers_count: number;
};
type Pagination = {
    data: Course[];
    current_page: number;
    last_page: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
type Filters = { search?: string };

export default function CoursesIndex({
    courses,
    filters,
}: {
    courses: Pagination;
    filters: Filters;
}) {
    const [query, setQuery] = useState({ search: filters.search ?? '' });
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
            <Head title='Kelas' />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kelas</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola kelas dan materi pembelajaran.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            Tambah kelas
                        </Link>
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
                            placeholder='Cari kelas'
                        />
                    </div>
                    <Button type="submit">Terapkan filter</Button>
                    {query.search && (
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
                        <table className="w-full min-w-225 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="p-4 font-bold">Kelas</th>
                                    <th className="font-bold">Kategori</th>
                                    <th className="font-bold">Status</th>
                                    <th className="font-bold">Tingkat</th>
                                    <th className="font-bold">Modul</th>
                                    <th className="font-bold">Materi</th>
                                    <th className="font-bold">Instruktur</th>
                                    <th className="text-center font-bold">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {courses.data.map((course, courseIndex) => (
                                    <tr key={course.id}>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {(courses.current_page - 1) *
                                                courses.per_page +
                                                courseIndex +
                                                1}
                                        </td>
                                        <td className="p-4 font-medium">
                                            {course.title}
                                        </td>
                                        <td>{course.category.name}</td>
                                        <td>{course.status}</td>
                                        <td>{course.level || '—'}</td>
                                        <td>{course.materials_count}</td>
                                        <td>{course.contents_count}</td>
                                        <td>{course.teachers_count}</td>
                                        <td className="px-5">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={edit(course.id)}
                                                    >
                                                        Ubah
                                                    </Link>
                                                </Button>
                                                <Button size="sm" asChild>
                                                    <Link
                                                        href={builder(
                                                            course.id,
                                                        )}
                                                    >
                                                        Builder
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/courses/${course.id}`}
                                                    >
                                                        Detail
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {courses.data.length === 0 && (
                        <div className="px-6 py-16 text-center">
                            <h2 className="font-semibold">Belum ada kelas</h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Tambah kelas atau ubah kata pencarian.
                            </p>
                        </div>
                    )}
                    {courses.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
                            <span className="text-muted-foreground">
                                Halaman {courses.current_page} dari{' '}
                                {courses.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    disabled={!courses.prev_page_url}
                                >
                                    <Link href={courses.prev_page_url ?? '#'}>
                                        Sebelumnya
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    disabled={!courses.next_page_url}
                                >
                                    <Link href={courses.next_page_url ?? '#'}>
                                        Berikutnya
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
