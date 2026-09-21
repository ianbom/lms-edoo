import { Head } from '@inertiajs/react';
import { Pencil, Plus, UserRound } from 'lucide-react';
import { useState } from 'react';
import { TeacherDialog } from '@/components/admin/teacher-dialog';
import { Button } from '@/components/ui/button';
import { index as teachersIndex } from '@/routes/admin/teachers';
import type { BreadcrumbItem } from '@/types';

type Teacher = {
    id: number;
    name: string;
    photo_url: string | null;
    expertise: string | null;
    courses_count: number;
    updated_at: string;
};

type Teachers = {
    data: Teacher[];
};

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(value),
    );

export default function TeachersIndex({ teachers }: { teachers: Teachers }) {
    const [formTeacher, setFormTeacher] = useState<Teacher | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const openCreateDialog = (): void => {
        setFormTeacher(null);
        setFormOpen(true);
    };

    const openEditDialog = (teacher: Teacher): void => {
        setFormTeacher(teacher);
        setFormOpen(true);
    };

    return (
        <>
            <Head title='Instruktur' />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Instruktur
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola profil instruktur yang digunakan di berbagai kelas.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus />
                        Tambah instruktur
                    </Button>
                </div>

                <div className="bg-card overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175 text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-5 py-3 font-bold">No.</th>
                                    <th className="px-5 py-3 font-bold">
                                        Instruktur
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
                                {teachers.data.map((teacher, teacherIndex) => (
                                    <tr
                                        key={teacher.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="text-muted-foreground px-5 py-4">
                                            {teacherIndex + 1}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {teacher.photo_url ? (
                                                    <img
                                                        src={teacher.photo_url}
                                                        alt=""
                                                        className="size-11 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="bg-secondary text-primary flex size-11 items-center justify-center rounded-full">
                                                        <UserRound className="size-5" />
                                                    </span>
                                                )}
                                                <div>
                                                    <p className="font-medium">
                                                        {teacher.name}
                                                    </p>
                                                    <p className="text-muted-foreground mt-1 text-sm">
                                                        {teacher.expertise ||
                                                            'Expertise not set'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {teacher.courses_count}
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {formatDate(teacher.updated_at)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    openEditDialog(teacher)
                                                }
                                            >
                                                <Pencil />
                                                Ubah
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {teachers.data.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <UserRound className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">Belum ada instruktur</h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Tambahkan profil instruktur pertama untuk
                                kelasmu.
                            </p>
                            <Button className="mt-5" onClick={openCreateDialog}>
                                <Plus />
                                Tambah instruktur
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {formOpen && (
                <TeacherDialog
                    teacher={formTeacher}
                    open={formOpen}
                    onOpenChange={setFormOpen}
                />
            )}
        </>
    );
}

TeachersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Instruktur',
            href: teachersIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
