import { Head } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { StudentDialog } from '@/components/admin/student-dialog';
import { Button } from '@/components/ui/button';
import { index as studentsIndex } from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';

type Student = {
    id: number;
    name: string;
    email: string;
    enrollments_count: number;
    completed_courses_count: number;
    created_at: string;
    last_login_at: string | null;
};

type Students = {
    data: Student[];
};

const formatDate = (value: string): string =>
    new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(value),
    );

export default function StudentsIndex({ students }: { students: Students }) {
    const [formOpen, setFormOpen] = useState(false);

    return (
        <>
            <Head title="Students" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Students
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage student accounts and monitor learning activity.
                        </p>
                    </div>
                    <Button onClick={() => setFormOpen(true)}>
                        <Plus />
                        Add student
                    </Button>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b text-xs tracking-wide uppercase">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Student</th>
                                    <th className="px-5 py-3 font-medium">Registered</th>
                                    <th className="px-5 py-3 font-medium">Courses</th>
                                    <th className="px-5 py-3 font-medium">Completed</th>
                                    <th className="px-5 py-3 font-medium">Last login</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.data.map((student) => (
                                    <tr key={student.id} className="hover:bg-muted/30">
                                        <td className="px-5 py-4">
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                {student.email}
                                            </p>
                                        </td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {formatDate(student.created_at)}
                                        </td>
                                        <td className="px-5 py-4">{student.enrollments_count}</td>
                                        <td className="px-5 py-4">{student.completed_courses_count}</td>
                                        <td className="text-muted-foreground px-5 py-4">
                                            {student.last_login_at
                                                ? formatDate(student.last_login_at)
                                                : 'Never'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {students.data.length === 0 && (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <Users className="text-muted-foreground size-10" />
                            <h2 className="mt-4 font-semibold">No students</h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Create the first student account to get started.
                            </p>
                            <Button className="mt-5" onClick={() => setFormOpen(true)}>
                                <Plus />
                                Add student
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {formOpen && (
                <StudentDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                />
            )}
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Students',
            href: studentsIndex(),
        },
    ] satisfies BreadcrumbItem[],
};
