import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import PasswordInput from '@/components/password-input';
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
import { Label } from '@/components/ui/label';

type Student = { id: number; name: string };

export function StudentPasswordDialog({
    student,
    open,
    onOpenChange,
}: {
    student: Student | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
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

        if (!student) {
            return;
        }

        form.put(`/admin/students/${student.id}/password`, {
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
                    <DialogTitle>Reset password siswa</DialogTitle>
                    <DialogDescription>
                        Atur password baru untuk {student?.name ?? 'siswa'}.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="student-reset-password">Password baru</Label>
                        <PasswordInput
                            id="student-reset-password"
                            value={form.data.password}
                            onChange={(event) =>
                                form.setData('password', event.target.value)
                            }
                            required
                            autoFocus
                            aria-invalid={Boolean(form.errors.password)}
                        />
                        <InputError message={form.errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="student-reset-password-confirmation">
                            Konfirmasi password
                        </Label>
                        <PasswordInput
                            id="student-reset-password-confirmation"
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
                            Batal
                        </Button>
                        <Button disabled={form.processing || !student}>
                            {form.processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Simpan password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
