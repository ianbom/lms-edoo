import { Head } from '@inertiajs/react';
import { CourseForm } from '@/components/admin/course-form';

type Option = { id: number; name: string };
type Course = { id: number; course_category_id: number; title: string; slug: string; short_description: string | null; description: string | null; level: string | null; estimated_duration_minutes: number | null; status: string; teachers: Option[] };
export default function EditCourse({ course, categories, teachers, statuses }: { course: Course; categories: Option[]; teachers: Option[]; statuses: string[] }) {
    return <><Head title="Edit Course" /><div className="space-y-6 p-4 md:p-6"><div><h1 className="text-2xl font-semibold">Edit Course</h1><p className="text-muted-foreground text-sm">Update course details and instructors.</p></div><CourseForm course={course} categories={categories} teachers={teachers} statuses={statuses} /></div></>;
}
