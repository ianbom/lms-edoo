import { useForm } from '@inertiajs/react';
import { Image, LoaderCircle, UploadCloud } from 'lucide-react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/CourseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Option = { id: number; name: string };
type Course = {
    id: number;
    course_category_id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    level: string | null;
    estimated_duration_minutes: number | null;
    status: string;
    teachers: Option[];
};

export function CourseForm({
    course,
    categories,
    teachers,
    statuses,
}: {
    course?: Course;
    categories: Option[];
    teachers: Option[];
    statuses: string[];
}) {
    const form = useForm({
        course_category_id: course?.course_category_id ?? '',
        title: course?.title ?? '',
        slug: course?.slug ?? '',
        short_description: course?.short_description ?? '',
        description: course?.description ?? '',
        level: course?.level ?? '',
        estimated_duration_minutes: course?.estimated_duration_minutes ?? '',
        status: course?.status ?? 'draft',
        teacher_ids: course?.teachers.map((teacher) => teacher.id) ?? [],
        thumbnail: null as File | null,
        banner: null as File | null,
    });
    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => form.reset('thumbnail', 'banner'),
        };
        course
            ? form.put(update.url(course.id), options)
            : form.post(store.url(), options);
    };
    const toggleTeacher = (
        teacherId: number,
        checked: boolean | 'indeterminate',
    ) =>
        form.setData(
            'teacher_ids',
            checked === true
                ? [...form.data.teacher_ids, teacherId]
                : form.data.teacher_ids.filter((id) => id !== teacherId),
        );

    return (
        <form
            onSubmit={submit}
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
            <div className="space-y-6">
                <section className="bg-card rounded-2xl border p-5 shadow-sm md:p-6">
                    <div className="mb-5">
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            01 · Foundation
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                            Core details
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Give this course a clear identity learners can
                            recognize.
                        </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="course-title">Title</Label>
                            <Input
                                id="course-title"
                                value={form.data.title}
                                onChange={(event) =>
                                    form.setData('title', event.target.value)
                                }
                                placeholder="e.g. Product Design Fundamentals"
                                required
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-slug">Slug</Label>
                            <Input
                                id="course-slug"
                                value={form.data.slug}
                                onChange={(event) =>
                                    form.setData('slug', event.target.value)
                                }
                                placeholder="product-design-fundamentals"
                                required
                            />
                            <InputError message={form.errors.slug} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={String(form.data.course_category_id)}
                                onValueChange={(value) =>
                                    form.setData(
                                        'course_category_id',
                                        Number(value),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={form.errors.course_category_id}
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-card rounded-2xl border p-5 shadow-sm md:p-6">
                    <div className="mb-5">
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            02 · Narrative
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                            Course description
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Explain the value of the course before learners
                            start.
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="course-short-description">
                                Short description
                            </Label>
                            <Input
                                id="course-short-description"
                                value={form.data.short_description}
                                onChange={(event) =>
                                    form.setData(
                                        'short_description',
                                        event.target.value,
                                    )
                                }
                                placeholder="A concise promise for the course card"
                            />
                            <InputError
                                message={form.errors.short_description}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-description">
                                Description
                            </Label>
                            <textarea
                                id="course-description"
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Describe outcomes, audience, and what learners will build..."
                                className="bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-40 resize-y rounded-lg border p-3 text-sm transition outline-none focus-visible:ring-[3px]"
                            />
                            <InputError message={form.errors.description} />
                        </div>
                    </div>
                </section>

                <section className="bg-card rounded-2xl border p-5 shadow-sm md:p-6">
                    <div className="mb-5">
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            03 · Delivery
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                            Delivery & visibility
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Set the learner-facing level, duration, and
                            publishing state.
                        </p>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="course-level">Level</Label>
                            <Input
                                id="course-level"
                                value={form.data.level}
                                onChange={(event) =>
                                    form.setData('level', event.target.value)
                                }
                                placeholder="Beginner"
                            />
                            <InputError message={form.errors.level} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-duration">
                                Duration (minutes)
                            </Label>
                            <Input
                                id="course-duration"
                                type="number"
                                min="0"
                                value={form.data.estimated_duration_minutes}
                                onChange={(event) =>
                                    form.setData(
                                        'estimated_duration_minutes',
                                        Number(event.target.value),
                                    )
                                }
                                placeholder="120"
                            />
                            <InputError
                                message={form.errors.estimated_duration_minutes}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={form.data.status}
                                onValueChange={(value) =>
                                    form.setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.status} />
                        </div>
                    </div>
                </section>

                <section className="bg-card rounded-2xl border p-5 shadow-sm md:p-6">
                    <div className="mb-5">
                        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                            04 · People
                        </p>
                        <h2 className="mt-1 text-lg font-semibold">
                            Instructors
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Choose who appears as the teaching team.
                        </p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                        {teachers.map((teacher) => (
                            <label
                                key={teacher.id}
                                className="bg-background hover:border-primary/40 flex items-center gap-3 rounded-lg border p-3 text-sm transition"
                            >
                                <Checkbox
                                    checked={form.data.teacher_ids.includes(
                                        teacher.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                        toggleTeacher(teacher.id, checked)
                                    }
                                />
                                <span>{teacher.name}</span>
                            </label>
                        ))}
                    </div>
                    <InputError message={form.errors.teacher_ids} />
                </section>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
                <section className="bg-card rounded-2xl border p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="bg-primary/10 text-primary rounded-lg p-2">
                            <Image className="size-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Course media</h2>
                            <p className="text-muted-foreground text-xs">
                                JPG, PNG, or WEBP
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="course-thumbnail">Thumbnail</Label>
                            <Input
                                id="course-thumbnail"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) =>
                                    form.setData(
                                        'thumbnail',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                className="h-auto cursor-pointer px-3 py-2 text-xs"
                            />
                            <p className="text-muted-foreground text-xs">
                                Shown in course lists and cards.
                            </p>
                            <InputError message={form.errors.thumbnail} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-banner">Banner</Label>
                            <Input
                                id="course-banner"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) =>
                                    form.setData(
                                        'banner',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                                className="h-auto cursor-pointer px-3 py-2 text-xs"
                            />
                            <p className="text-muted-foreground text-xs">
                                Used on the course detail header.
                            </p>
                            <InputError message={form.errors.banner} />
                        </div>
                    </div>
                </section>
                <section className="bg-muted/30 rounded-2xl border border-dashed p-5">
                    <UploadCloud className="text-primary mb-3 size-5" />
                    <h3 className="font-semibold">Ready for materials?</h3>
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                        After saving, continue to Course Builder to add modules,
                        videos, and textbooks.
                    </p>
                </section>
                <Button className="h-11 w-full" disabled={form.processing}>
                    {form.processing && (
                        <LoaderCircle className="animate-spin" />
                    )}{' '}
                    {course ? 'Save changes' : 'Create course'}
                </Button>
            </aside>
        </form>
    );
}
