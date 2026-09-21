import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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

type Course = { id: number; title: string };
type Material = {
    id: number;
    course_id: number;
    title: string;
    description: string | null;
    position: number;
    is_published: boolean;
};

export function CourseMaterialDialog({
    material,
    courses,
    open,
    onOpenChange,
}: {
    material: Material | null;
    courses: Course[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
        course_id: material?.course_id ? String(material.course_id) : '',
        title: material?.title ?? '',
        description: material?.description ?? '',
        position: material?.position ?? 0,
        is_published: material?.is_published ?? true,
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
        material
            ? form.put(`/admin/course-materials/${material.id}`, options)
            : form.post('/admin/course-materials', options);
    };
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) =>
                !nextOpen && !form.processing && onOpenChange(false)
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {material
                            ? 'Ubah modul kelas'
                            : 'Buat modul kelas'}
                    </DialogTitle>
                    <DialogDescription>
                        Susun kelas menjadi modul pembelajaran yang rapi.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-5" onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label>Kelas</Label>
                        <Select
                            value={form.data.course_id}
                            onValueChange={(value) =>
                                form.setData('course_id', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Pilih kelas' />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={String(course.id)}
                                    >
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.course_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="material-title">Judul</Label>
                        <Input
                            id="material-title"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData('title', event.target.value)
                            }
                            required
                        />
                        <InputError message={form.errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="material-description">
                            Deskripsi
                        </Label>
                        <textarea
                            id="material-description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            className="focus-visible:ring-ring/50 min-h-24 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                        />
                        <InputError message={form.errors.description} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="material-position">Urutan</Label>
                        <Input
                            id="material-position"
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
                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={form.data.is_published}
                            onCheckedChange={(checked) =>
                                form.setData('is_published', checked === true)
                            }
                        />{' '}
                        Dipublikasikan
                    </label>
                    <DialogFooter>
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
                            {material ? 'Simpan perubahan' : 'Buat modul'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
