import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/CourseCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CourseCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

type CourseCategoryDialogProps = {
    category: CourseCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export function CourseCategoryDialog({
    category,
    open,
    onOpenChange,
}: CourseCategoryDialogProps) {
    const [slugIsAutomatic, setSlugIsAutomatic] = useState(true);
    const form = useForm({ name: '', slug: '', description: '' });
    const isEditing = category !== null;

    useEffect(() => {
        if (!open) {
            return;
        }

        form.clearErrors();

        if (category) {
            form.setData({
                name: category.name,
                slug: category.slug,
                description: category.description ?? '',
            });
            setSlugIsAutomatic(false);

            return;
        }

        form.reset();
        setSlugIsAutomatic(true);
    }, [category, form, open]);

    const close = (): void => {
        if (!form.processing) {
            onOpenChange(false);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        };

        if (category) {
            form.put(update.url(category.id), options);

            return;
        }

        form.post(store.url(), options);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) =>
                nextOpen ? onOpenChange(true) : close()
            }
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit course category'
                            : 'Create course category'}
                    </DialogTitle>
                    <DialogDescription>
                        Use categories to group related courses in the catalog.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="course-category-name">Name</Label>
                        <Input
                            id="course-category-name"
                            value={form.data.name}
                            onChange={(event) => {
                                const name = event.target.value;
                                form.setData('name', name);

                                if (slugIsAutomatic) {
                                    form.setData('slug', slugify(name));
                                }
                            }}
                            autoFocus
                            required
                            aria-invalid={Boolean(form.errors.name)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="course-category-slug">Slug</Label>
                        <Input
                            id="course-category-slug"
                            value={form.data.slug}
                            onChange={(event) => {
                                setSlugIsAutomatic(false);
                                form.setData(
                                    'slug',
                                    slugify(event.target.value),
                                );
                            }}
                            required
                            aria-invalid={Boolean(form.errors.slug)}
                        />
                        <InputError message={form.errors.slug} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="course-category-description">
                            Description
                        </Label>
                        <textarea
                            id="course-category-description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                            aria-invalid={Boolean(form.errors.description)}
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button disabled={form.processing}>
                            {form.processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            {isEditing ? 'Save changes' : 'Create category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
