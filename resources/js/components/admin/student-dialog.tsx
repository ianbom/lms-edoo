import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/Admin/StudentController';
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

export function StudentDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const close = (): void => {
        if (!form.processing) {
            onOpenChange(false);
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        form.post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
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
                    <DialogTitle>Add student</DialogTitle>
                    <DialogDescription>
                        Create a student account with immediate access to login.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="student-name">Name</Label>
                        <Input
                            id="student-name"
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
                        <Label htmlFor="student-phone">Phone</Label>
                        <Input
                            id="student-phone"
                            type="tel"
                            value={form.data.phone}
                            onChange={(event) =>
                                form.setData('phone', event.target.value)
                            }
                            required
                            aria-invalid={Boolean(form.errors.phone)}
                        />
                        <InputError message={form.errors.phone} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="student-email">Email (optional)</Label>
                        <Input
                            id="student-email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) =>
                                form.setData('email', event.target.value)
                            }
                            aria-invalid={Boolean(form.errors.email)}
                        />
                        <InputError message={form.errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="student-password">Password</Label>
                        <Input
                            id="student-password"
                            type="password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                            required
                            aria-invalid={Boolean(form.errors.password)}
                        />
                        <InputError message={form.errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="student-password-confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="student-password-confirmation"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(event) =>
                                form.setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                            required
                        />
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
                            Create student
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
