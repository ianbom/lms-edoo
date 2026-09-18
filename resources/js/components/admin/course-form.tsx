import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { store, update } from '@/actions/App/Http/Controllers/Admin/CourseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Option = { id: number; name: string };
type Course = { id: number; course_category_id: number; title: string; slug: string; short_description: string | null; description: string | null; level: string | null; estimated_duration_minutes: number | null; status: string; teachers: Option[] };

export function CourseForm({ course, categories, teachers, statuses }: { course?: Course; categories: Option[]; teachers: Option[]; statuses: string[] }) {
    const form = useForm({
        course_category_id: course?.course_category_id ?? '', title: course?.title ?? '', slug: course?.slug ?? '', short_description: course?.short_description ?? '', description: course?.description ?? '', level: course?.level ?? '', estimated_duration_minutes: course?.estimated_duration_minutes ?? '', status: course?.status ?? 'draft', teacher_ids: course?.teachers.map((teacher) => teacher.id) ?? [], thumbnail: null as File | null, banner: null as File | null,
    });
    const submit = (event: React.FormEvent<HTMLFormElement>): void => { event.preventDefault(); const options = { forceFormData: true, onSuccess: () => form.reset('thumbnail', 'banner') }; course ? form.put(update.url(course.id), options) : form.post(store.url(), options); };
    return <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6">
        <div className="grid gap-2"><Label htmlFor="course-title">Title</Label><Input id="course-title" value={form.data.title} onChange={(event) => form.setData('title', event.target.value)} required /><InputError message={form.errors.title} /></div>
        <div className="grid gap-2"><Label htmlFor="course-slug">Slug</Label><Input id="course-slug" value={form.data.slug} onChange={(event) => form.setData('slug', event.target.value)} required /><InputError message={form.errors.slug} /></div>
        <div className="grid gap-2"><Label htmlFor="course-category">Category</Label><select id="course-category" value={form.data.course_category_id} onChange={(event) => form.setData('course_category_id', Number(event.target.value))} required className="h-10 rounded-md border bg-background px-3"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><InputError message={form.errors.course_category_id} /></div>
        <div className="grid gap-2"><Label htmlFor="course-short-description">Short description</Label><Input id="course-short-description" value={form.data.short_description} onChange={(event) => form.setData('short_description', event.target.value)} /></div>
        <div className="grid gap-2"><Label htmlFor="course-description">Description</Label><textarea id="course-description" value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="min-h-32 rounded-md border bg-background p-3" /></div>
        <div className="grid gap-4 sm:grid-cols-3"><div className="grid gap-2"><Label htmlFor="course-level">Level</Label><Input id="course-level" value={form.data.level} onChange={(event) => form.setData('level', event.target.value)} /></div><div className="grid gap-2"><Label htmlFor="course-duration">Duration minutes</Label><Input id="course-duration" type="number" value={form.data.estimated_duration_minutes} onChange={(event) => form.setData('estimated_duration_minutes', Number(event.target.value))} /></div><div className="grid gap-2"><Label htmlFor="course-status">Status</Label><select id="course-status" value={form.data.status} onChange={(event) => form.setData('status', event.target.value)} className="h-10 rounded-md border bg-background px-3">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
        <div className="grid gap-2"><Label htmlFor="course-teachers">Teachers</Label><select id="course-teachers" multiple value={form.data.teacher_ids.map(String)} onChange={(event) => form.setData('teacher_ids', Array.from(event.target.selectedOptions, (option) => Number(option.value)))} className="min-h-28 rounded-md border bg-background p-2">{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}</select></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="course-thumbnail">Thumbnail</Label><Input id="course-thumbnail" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => form.setData('thumbnail', event.target.files?.[0] ?? null)} /></div><div className="grid gap-2"><Label htmlFor="course-banner">Banner</Label><Input id="course-banner" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => form.setData('banner', event.target.files?.[0] ?? null)} /></div></div>
        <Button disabled={form.processing}>{form.processing && <LoaderCircle className="animate-spin" />}Save course</Button>
    </form>;
}
