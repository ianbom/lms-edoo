import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Clock3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as studentsIndex } from '@/routes/admin/students';

type Enrollment = {
    id: number;
    course: {
        id: number | null;
        title: string;
        category: string | null;
    };
    status: 'enrolled' | 'in_progress' | 'completed';
    progress_percentage: number;
    materials_count: number;
    completed_materials: number;
    enrolled_at: string | null;
    last_activity_at: string | null;
    completed_at: string | null;
};

const formatDate = (value: string | null): string => {
    if (!value) return '—';

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

const statusLabel: Record<Enrollment['status'], string> = {
    enrolled: 'Terdaftar',
    in_progress: 'Berlangsung',
    completed: 'Selesai',
};

const statusClass: Record<Enrollment['status'], string> = {
    enrolled: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-primary/10 text-primary',
    completed: 'bg-emerald-100 text-emerald-700',
};

export default function StudentProgress({
    student,
    enrollments,
}: {
    student: {
        id: number;
        name: string;
        email: string | null;
        phone: string;
    };
    enrollments: Enrollment[];
}) {
    return (
        <>
            <Head title={`Progress ${student.name}`} />

            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <span className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-xl">
                            <GraduationCap className="size-6" />
                        </span>
                        <div>
                            <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                                Progress Belajar Siswa
                            </p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                {student.name}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {student.email ?? student.phone}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={studentsIndex()}>
                            <ArrowLeft />
                            Kembali ke Siswa
                        </Link>
                    </Button>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Kelas Terdaftar</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Pantau kemajuan belajar pada setiap kelas.
                        </p>
                    </div>

                    {enrollments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-250 text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b text-xs tracking-wide uppercase">
                                    <tr>
                                        <th className="w-16 px-5 py-3 font-medium">
                                            No.
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Kelas
                                        </th>
                                        <th className="min-w-52 px-5 py-3 font-medium">
                                            Progress
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Materi
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Terakhir Belajar
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Terdaftar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {enrollments.map((enrollment, index) => {
                                        const progress = Math.round(
                                            enrollment.progress_percentage,
                                        );

                                        return (
                                            <tr
                                                key={enrollment.id}
                                                className="hover:bg-muted/30"
                                            >
                                                <td className="text-muted-foreground px-5 py-4">
                                                    {index + 1}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="font-medium">
                                                        {
                                                            enrollment.course
                                                                .title
                                                        }
                                                    </p>
                                                    {enrollment.course
                                                        .category && (
                                                        <p className="text-muted-foreground mt-1 text-xs">
                                                            {
                                                                enrollment
                                                                    .course
                                                                    .category
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="bg-muted h-2 min-w-28 flex-1 overflow-hidden rounded-full">
                                                            <div
                                                                className="bg-primary h-full rounded-full"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-primary w-10 text-right text-xs font-semibold">
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {
                                                        enrollment.completed_materials
                                                    }
                                                    /
                                                    {enrollment.materials_count}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[enrollment.status]}`}
                                                    >
                                                        {
                                                            statusLabel[
                                                                enrollment
                                                                    .status
                                                            ]
                                                        }
                                                    </span>
                                                </td>
                                                <td className="text-muted-foreground px-5 py-4">
                                                    <span className="flex items-center gap-2 whitespace-nowrap">
                                                        <Clock3 className="size-4" />
                                                        {formatDate(
                                                            enrollment.last_activity_at,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">
                                                    {formatDate(
                                                        enrollment.enrolled_at,
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                            <span className="bg-primary/10 text-primary grid size-12 place-items-center rounded-full">
                                <BookOpen className="size-6" />
                            </span>
                            <h2 className="mt-4 font-semibold">
                                Belum ada kelas terdaftar
                            </h2>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                Siswa ini belum mendaftar pada kelas mana pun.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
