import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { Bold, Code, Code2, Heading1, Heading2, Heading3, Italic, Link2, Link2Off, List, ListOrdered, Minus, Quote, Redo2, RemoveFormatting, Strikethrough, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TextbookEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const editor = useEditor({
        extensions: [StarterKit, Link.configure({ openOnClick: false })],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });
    useEffect(() => {
        if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    if (!editor) return null;
    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Masukkan URL tautan', previousUrl ?? '');
        if (url === null) return;
        if (!url.trim()) { editor.chain().focus().unsetLink().run(); return; }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };
    const buttonClassName = (active = false) => 'size-8 rounded-sm ' + (active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground');

    return (
        <div className="overflow-hidden rounded-md border focus-within:ring-2 focus-within:ring-ring/50">
            <div className="flex flex-wrap gap-1 border-b bg-muted/30 p-2">
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('heading', { level: 1 }))} aria-label="Judul besar" title="Judul besar" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('heading', { level: 2 }))} aria-label="Judul sedang" title="Judul sedang" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('heading', { level: 3 }))} aria-label="Judul kecil" title="Judul kecil" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 /></Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={buttonClassName(editor.isActive('bold'))}
                    aria-label='Tebal'
                    title="Tebal"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={buttonClassName(editor.isActive('italic'))}
                    aria-label='Miring'
                    title="Miring"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic />
                </Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('strike'))} aria-label="Coret" title="Coret" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('code'))} aria-label="Kode baris" title="Kode baris" onClick={() => editor.chain().focus().toggleCode().run()}><Code2 /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('link'))} aria-label="Tambah tautan" title="Tambah tautan" onClick={setLink}><Link2 /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName()} aria-label="Hapus tautan" title="Hapus tautan" onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off /></Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={buttonClassName(editor.isActive('bulletList'))}
                    aria-label='Daftar berpoin'
                    title="Daftar berpoin"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={buttonClassName(editor.isActive('orderedList'))}
                    aria-label='Daftar bernomor'
                    title="Daftar bernomor"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered />
                </Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName(editor.isActive('blockquote'))} aria-label="Kutipan" title="Kutipan" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></Button>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={buttonClassName(editor.isActive('codeBlock'))}
                    aria-label='Blok kode'
                    title="Blok kode"
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                >
                    <Code />
                </Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName()} aria-label="Garis pemisah" title="Garis pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName()} aria-label="Hapus format" title="Hapus format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName()} aria-label="Urungkan" title="Urungkan" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 /></Button>
                <Button type="button" size="icon" variant="ghost" className={buttonClassName()} aria-label="Ulangi" title="Ulangi" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 /></Button>
            </div>
            <EditorContent
                editor={editor}
                className="max-h-[50vh] min-h-64 overflow-y-auto p-4 text-sm [&_.ProseMirror]:min-h-56 [&_.ProseMirror]:outline-none [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary/40 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_hr]:my-6 [&_.ProseMirror_ol]:my-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-slate-950 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-slate-50 [&_.ProseMirror_ul]:my-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
            />
        </div>
    );
}
