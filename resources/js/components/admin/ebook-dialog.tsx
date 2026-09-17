import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Admin/EbookController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type EbookCategoryOption = { id: number; name: string };

export type Ebook = {
    id: number;
    ebook_category_id: number;
    title: string;
    slug: string;
    author: string | null;
    short_description: string | null;
    description: string | null;
    cover_url: string | null;
    file_url: string | null;
    file_name: string | null;
    file_size: number | null;
    total_pages: number | null;
    status: 'draft' | 'published' | 'archived';
    published_at: string | null;
    updated_at: string;
    category: EbookCategoryOption;
};

type Props = {
    ebook: Ebook | null;
    categories: EbookCategoryOption[];
    statuses: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EbookDialog({
    ebook,
    categories,
    statuses,
    open,
    onOpenChange,
}: Props) {
    const form = useForm({
        ebook_category_id: String(ebook?.ebook_category_id ?? ''),
        title: ebook?.title ?? '',
        slug: ebook?.slug ?? '',
        author: ebook?.author ?? '',
        short_description: ebook?.short_description ?? '',
        description: ebook?.description ?? '',
        cover: null as File | null,
        file: null as File | null,
        total_pages: ebook?.total_pages ? String(ebook.total_pages) : '',
        status: ebook?.status ?? 'draft',
        published_at: ebook?.published_at?.slice(0, 10) ?? '',
    });

    const close = (): void => {
        if (!form.processing) onOpenChange(false);
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

        if (ebook) {
            form.put(update.url(ebook.id), options);
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
            <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {ebook ? 'Edit ebook' : 'Create ebook'}
                    </DialogTitle>
                    <DialogDescription>
                        Add the ebook metadata, cover, and downloadable PDF.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                            label="Category"
                            error={form.errors.ebook_category_id}
                        >
                            <Select
                                value={form.data.ebook_category_id}
                                onValueChange={(value) =>
                                    form.setData('ebook_category_id', value)
                                }
                            >
                                <SelectTrigger className="w-full">
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
                        </Field>
                        <Field label="Status" error={form.errors.status}>
                            <Select
                                value={form.data.status}
                                onValueChange={(value) =>
                                    form.setData(
                                        'status',
                                        value as typeof form.data.status,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {formatStatus(status)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Title" error={form.errors.title}>
                            <Input
                                value={form.data.title}
                                onChange={(event) =>
                                    form.setData('title', event.target.value)
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
                                placeholder="laravel-basics"
                                required
                            />
                        </Field>
                        <Field label="Author" error={form.errors.author}>
                            <Input
                                value={form.data.author}
                                onChange={(event) =>
                                    form.setData('author', event.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Total pages"
                            error={form.errors.total_pages}
                        >
                            <Input
                                type="number"
                                min="1"
                                value={form.data.total_pages}
                                onChange={(event) =>
                                    form.setData(
                                        'total_pages',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Cover" error={form.errors.cover}>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(event) =>
                                    form.setData(
                                        'cover',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {ebook?.cover_url && !form.data.cover && (
                                <p className="text-muted-foreground text-xs">
                                    Existing cover will be kept.
                                </p>
                            )}
                        </Field>
                        <Field label="PDF file" error={form.errors.file}>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(event) =>
                                    form.setData(
                                        'file',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {ebook?.file_name && !form.data.file && (
                                <p className="text-muted-foreground text-xs">
                                    Existing file: {ebook.file_name}
                                </p>
                            )}
                        </Field>
                        <Field
                            label="Published date"
                            error={form.errors.published_at}
                        >
                            <Input
                                type="date"
                                value={form.data.published_at}
                                onChange={(event) =>
                                    form.setData(
                                        'published_at',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>

                    <Field
                        label="Short description"
                        error={form.errors.short_description}
                    >
                        <textarea
                            value={form.data.short_description}
                            onChange={(event) =>
                                form.setData(
                                    'short_description',
                                    event.target.value,
                                )
                            }
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        />
                    </Field>
                    <Field label="Description" error={form.errors.description}>
                        <textarea
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                        />
                    </Field>

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
                            {ebook ? 'Save changes' : 'Create ebook'}
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

export function formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}
