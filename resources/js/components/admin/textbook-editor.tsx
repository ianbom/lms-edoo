import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Code, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TextbookEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const editor = useEditor({ extensions: [StarterKit, Link], content: value, onUpdate: ({ editor }) => onChange(editor.getHTML()) });
    if (!editor) return null;
    return <div className="rounded-md border"><div className="flex gap-1 border-b p-2"><Button type="button" size="icon" variant="ghost" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></Button><Button type="button" size="icon" variant="ghost" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></Button><Button type="button" size="icon" variant="ghost" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></Button><Button type="button" size="icon" variant="ghost" aria-label="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></Button><Button type="button" size="icon" variant="ghost" aria-label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code /></Button></div><EditorContent editor={editor} className="prose max-w-none p-3 focus:outline-none" /></div>;
}
