import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Admin/CourseCategoryController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type CourseCategory = {
    id: number;
    name: string;
};

type DeleteCourseCategoryDialogProps = {
    category: CourseCategory | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteCourseCategoryDialog({
    category,
    open,
    onOpenChange,
}: DeleteCourseCategoryDialogProps) {
    const [processing, setProcessing] = useState(false);

    const remove = (): void => {
        if (!category) {
            return;
        }

        router.delete(destroy.url(category.id), {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus kategori kelas?</DialogTitle>
                    <DialogDescription>
                        “{category?.name}” akan dihapus dari daftar kategori
                        aktif.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={remove}
                        disabled={processing}
                    >
                        {processing && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        Hapus kategori
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
