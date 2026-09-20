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
            <Head title="Teachers" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Teachers
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage instructor profiles used across courses.
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus />
                        Add teacher
                    </Button>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-175 text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-xs tracking-wide uppercase">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Teacher
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Courses
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Updated
                                    </th>
                                    <th className="px-5 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {teachers.data.map((teacher) => (
                                    <tr
                                        key={teacher.id}
                                        className="hover:bg-muted/30"
                                    >
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
                                                Edit
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
                            <h2 className="mt-4 font-semibold">No teachers</h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Add the first instructor profile for your
                                courses.
                            </p>
                            <Button className="mt-5" onClick={openCreateDialog}>
                                <Plus />
                                Add teacher
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
            title: 'Teachers',
            href: teachersIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
