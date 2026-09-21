import { Head, Link, router } from '@inertiajs/react';
import { ChartNoAxesCombined, Plus, Search, Users, X } from 'lucide-react';
import { useState } from 'react';
import { StudentDialog } from '@/components/admin/student-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as studentsIndex } from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';

type Student = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    enrollments_count: number;
    completed_courses_count: number;
    created_at: string;
};

type Students = {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Filters = { search?: string; per_page?: number };

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(value),
    );

export default function StudentsIndex({
    students,
    filters,
}: {
    students: Students;
    filters: Filters;
}) {
    const [formOpen, setFormOpen] = useState(false);
    const [query, setQuery] = useState({
        search: filters.search ?? '',
        per_page: String(filters.per_page ?? 15),
    });

    const visitPage = (page: number): void => {
        router.get(
            studentsIndex.url(),
            { ...query, page },
            { preserveState: true, replace: true },
        );
    };

    const applyFilters = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        visitPage(1);
    };

    const clearFilters = (): void => {
        const empty = { search: '', per_page: '15' };
        setQuery(empty);
        router.get(studentsIndex.url(), empty, {
            preserveState: true,
            replace: true,
        });
    };

    const pages = Array.from(
        { length: students.last_page },
        (_, index) => index + 1,
    );

    return (
        <>
            <Head title="Siswa" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Siswa
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola akun siswa dan pantau aktivitas belajar.
                        </p>
                    </div>
                    <Button onClick={() => setFormOpen(true)}>
                        <Plus />
                        Tambah siswa
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
                                setQuery({
                                    ...query,
                                    search: event.target.value,
                                })
                            }
                            className="pl-9"
                            placeholder="Cari nama, nomor telepon, atau email"
                        />
                    </div>
                    <Select
                        value={query.per_page}
                        onValueChange={(value) =>
                            setQuery({ ...query, per_page: value })
                        }
                    >
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Per halaman" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 15, 25].map((value) => (
                                <SelectItem key={value} value={String(value)}>
                                    {value} per halaman
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit">Terapkan filter</Button>
                    {(query.search || query.per_page !== '15') && (
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
                                    <th className="px-5 py-3 font-bold">
                                        No.
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Siswa
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Nomor telepon
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Terdaftar
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Kelas
                                    </th>
                                    <th className="px-5 py-3 font-bold">
                                        Selesai
                                    </th>
                                    <th className="px-5 py-3 text-right font-bold">
                                        Tindakan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.data.map((student, studentIndex) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="text-muted-foreground px-5 py-4">
                                            {(students.current_page - 1) *
                                                students.per_page +
                                                studentIndex +
                                                1}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {student.name}
                                            </p>
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                {student.email ??
                                                    'Email belum tersedia'}
                                            </p>
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {student.phone}
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {formatDate(student.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {student.enrollments_count}
                                        </td>
                                        <td className="px-5 py-4">
                                            {student.completed_courses_count}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/students/${student.id}/progress`}
                                                >
                                                    <ChartNoAxesCombined />
                                                    Progress
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {students.data.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <Users className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">
                                Belum ada siswa
                            </h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Tambahkan akun siswa pertama untuk mulai.
                            </p>
                            <Button
                                className="mt-5"
                                onClick={() => setFormOpen(true)}
                            >
                                <Plus />
                                Tambah siswa
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-muted-foreground">
                            Halaman {students.current_page} dari{' '}
                            {students.last_page}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!students.prev_page_url}
                                onClick={() => visitPage(students.current_page - 1)}
                            >
                                Sebelumnya
                            </Button>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    type="button"
                                    variant={
                                        page === students.current_page
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
                                disabled={!students.next_page_url}
                                onClick={() => visitPage(students.current_page + 1)}
                            >
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {formOpen && (
                <StudentDialog open={formOpen} onOpenChange={setFormOpen} />
            )}
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Siswa',
            href: studentsIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
