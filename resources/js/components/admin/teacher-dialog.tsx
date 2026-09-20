import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/TeacherController';
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

type Teacher = {
    id: number;
    name: string;
    expertise: string | null;
};

export function TeacherDialog({
    teacher,
    open,
    onOpenChange,
}: {
    teacher: Teacher | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
        name: teacher?.name ?? '',
        expertise: teacher?.expertise ?? '',
        photo: null as File | null,
    });
    const isEditing = teacher !== null;

    const close = (): void => {
        if (!form.processing) {
            onOpenChange(false);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        };

        if (teacher) {
            form.put(update.url(teacher.id), options);

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
                        {isEditing ? 'Edit teacher' : 'Add teacher'}
                    </DialogTitle>
                    <DialogDescription>
                        Add the instructor details shown on course pages.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="teacher-name">Name</Label>
                        <Input
                            id="teacher-name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            autoFocus
                            required
                            aria-invalid={Boolean(form.errors.name)}
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="teacher-expertise">Expertise</Label>
                        <Input
                            id="teacher-expertise"
                            value={form.data.expertise}
                            onChange={(event) =>
                                form.setData('expertise', event.target.value)
                            }
                            placeholder="Backend Development"
                            aria-invalid={Boolean(form.errors.expertise)}
                        />
                        <InputError message={form.errors.expertise} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="teacher-photo">Photo</Label>
                        <Input
                            id="teacher-photo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) =>
                                form.setData(
                                    'photo',
                                    event.target.files?.[0] ?? null,
                                )
                            }
                            aria-invalid={Boolean(form.errors.photo)}
                        />
                        <InputError message={form.errors.photo} />
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
                            {isEditing ? 'Save changes' : 'Create teacher'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
