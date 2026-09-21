import { Head } from '@inertiajs/react';
import { CourseForm } from '@/components/admin/course-form';

type Option = { id: number; name: string };
export default function CreateCourse({
    categories,
    teachers,
    statuses,
}: {
    categories: Option[];
    teachers: Option[];
    statuses: string[];
}) {
    return (
        <>
            <Head title='Buat Kelas' />
            <div className="space-y-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold">Buat Kelas</h1>
                    <p className="text-muted-foreground text-sm">
                        Isi detail kelas sebelum menambahkan materi pembelajaran.
                    </p>
                </div>
                <CourseForm
                    categories={categories}
                    teachers={teachers}
                    statuses={statuses}
                />
            </div>
        </>
    );
}
