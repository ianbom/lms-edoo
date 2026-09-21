import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/EbookCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export type EbookCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    position: number;
    ebooks_count: number;
    updated_at: string;
};

type EbookCategoryDialogProps = {
    category: EbookCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EbookCategoryDialog({
    category,
    open,
    onOpenChange,
}: EbookCategoryDialogProps) {
    const form = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        is_active: category?.is_active ?? true,
        position: String(category?.position ?? 0),
    });
    const isEditing = category !== null;

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
            <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Ubah kategori e-book'
                            : 'Buat kategori e-book'}
                    </DialogTitle>
                    <DialogDescription>
                        Kelompokkan e-book untuk katalog bacaan.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Nama" error={form.errors.name}>
                            <Input
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                autoFocus
                                required
                            />
                        </Field>
                        <Field label="Slug" error={form.errors.slug}>
                            <Input
                                value={form.data.slug}
                                onChange={(event) =>
                                    form.setData('slug', event.target.value)
                                }
                                placeholder="programming"
                                required
                            />
                        </Field>
                        <Field label="Urutan" error={form.errors.position}>
                            <Input
                                type="number"
                                min="0"
                                value={form.data.position}
                                onChange={(event) =>
                                    form.setData('position', event.target.value)
                                }
                                required
                            />
                        </Field>
                    </div>

                    <Field label="Deskripsi" error={form.errors.description}>
                        <textarea
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        />
                    </Field>

                    <label className="flex items-center gap-3 text-sm font-medium">
                        <Checkbox
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked === true)
                            }
                        />
                        Kategori aktif
                    </label>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button disabled={form.processing}>
                            {form.processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            {isEditing ? 'Simpan perubahan' : 'Buat kategori'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
