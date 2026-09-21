import { router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Admin/EbookController';
import type { Ebook } from '@/components/admin/ebook-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    ebook: Ebook | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteEbookDialog({ ebook, open, onOpenChange }: Props) {
    const [processing, setProcessing] = useState(false);
    const remove = (): void => {
        if (!ebook) return;
        router.delete(destroy.url(ebook.id), {
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
                    <DialogTitle>Hapus e-book?</DialogTitle>
                    <DialogDescription>
                        “{ebook?.title}” akan dihapus dari katalog e-book.
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
                        Hapus e-book
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
