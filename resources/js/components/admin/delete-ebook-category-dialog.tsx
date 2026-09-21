import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Admin/EbookCategoryController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Category = { id: number; name: string };

export function DeleteEbookCategoryDialog({
    category,
    open,
    onOpenChange,
}: {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
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
                    <DialogTitle>Hapus kategori e-book?</DialogTitle>
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
