import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { TextbookEditor } from '@/components/admin/textbook-editor';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Material = { id: number; title: string; course: { title: string } };
type Content = {
    id: number;
    course_material_id: number;
    type: 'video' | 'textbook';
    title: string;
    description: string | null;
    position: number;
    youtube_url: string | null;
    textbook_content: string | null;
    attachment_url: string | null;
    is_published: boolean;
};

export function LearningContentDialog({
    content,
    materials,
    open,
    onOpenChange,
}: {
    content: Content | null;
    materials: Material[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
        course_material_id: content?.course_material_id
            ? String(content.course_material_id)
            : '',
        type: content?.type ?? 'video',
        title: content?.title ?? '',
        description: content?.description ?? '',
        position: content?.position ?? 0,
        youtube_url: content?.youtube_url ?? '',
        textbook_content: content?.textbook_content ?? '',
        attachment_url: content?.attachment_url ?? '',
        is_published: content?.is_published ?? true,
    });
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        };
        content
            ? form.put(`/admin/learning-contents/${content.id}`, options)
            : form.post('/admin/learning-contents', options);
    };
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) =>
                !nextOpen && !form.processing && onOpenChange(false)
            }
        >
            <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden sm:max-w-2xl">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {content
                            ? 'Ubah materi'
                            : 'Buat materi pembelajaran'}
                    </DialogTitle>
                    <DialogDescription>
                        Tambahkan video atau bab bacaan ke dalam modul.
                    </DialogDescription>
                </DialogHeader>
                <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-1 pr-3">
                    <div className="grid gap-2">
                        <Label>Modul</Label>
                        <Select
                            value={form.data.course_material_id}
                            onValueChange={(value) =>
                                form.setData('course_material_id', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Pilih modul' />
                            </SelectTrigger>
                            <SelectContent>
                                {materials.map((material) => (
                                    <SelectItem
                                        key={material.id}
                                        value={String(material.id)}
                                    >
                                        {material.course.title} ·{' '}
                                        {material.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.course_material_id} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                        <div className="grid gap-2">
                            <Label htmlFor="content-title">Judul</Label>
                            <Input
                                id="content-title"
                                value={form.data.title}
                                onChange={(event) =>
                                    form.setData('title', event.target.value)
                                }
                                required
                            />
                            <InputError message={form.errors.title} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Jenis</Label>
                            <Select
                                value={form.data.type}
                                onValueChange={(value) =>
                                    form.setData(
                                        'type',
                                        value as 'video' | 'textbook',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="textbook">
                                        Bacaan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.type} />
                        </div>
                    </div>
                    {form.data.type === 'video' ? (
                        <div className="grid gap-2">
                            <Label htmlFor="youtube-url">URL YouTube</Label>
                            <Input
                                id="youtube-url"
                                value={form.data.youtube_url}
                                onChange={(event) =>
                                    form.setData(
                                        'youtube_url',
                                        event.target.value,
                                    )
                                }
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <InputError message={form.errors.youtube_url} />
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label>Isi bacaan</Label>
                            <TextbookEditor
                                value={form.data.textbook_content}
                                onChange={(value) =>
                                    form.setData('textbook_content', value)
                                }
                            />
                            <InputError
                                message={form.errors.textbook_content}
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="content-description">Deskripsi</Label>
                        <textarea
                            id="content-description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            className="focus-visible:ring-ring/50 min-h-20 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                        />
                        <InputError message={form.errors.description} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="content-position">Urutan</Label>
                            <Input
                                id="content-position"
                                type="number"
                                min="0"
                                value={form.data.position}
                                onChange={(event) =>
                                    form.setData(
                                        'position',
                                        Number(event.target.value),
                                    )
                                }
                                required
                            />
                            <InputError message={form.errors.position} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="attachment-url">
                                URL lampiran
                            </Label>
                            <Input
                                id="attachment-url"
                                value={form.data.attachment_url}
                                onChange={(event) =>
                                    form.setData(
                                        'attachment_url',
                                        event.target.value,
                                    )
                                }
                                placeholder='Opsional'
                            />
                            <InputError message={form.errors.attachment_url} />
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={form.data.is_published}
                            onCheckedChange={(checked) =>
                                form.setData('is_published', checked === true)
                            }
                        />{' '}
                        Dipublikasikan
                    </label>
                    </div>
                    <DialogFooter className="shrink-0 border-t bg-background pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button disabled={form.processing}>
                            {form.processing && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            {content ? 'Simpan perubahan' : 'Buat materi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
