import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock3, FileText, GripVertical, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Content = { id: number; type: 'video' | 'textbook'; title: string; description: string | null; position: number; video_duration_seconds: number | null; is_published: boolean };
type Material = { id: number; title: string; description: string | null; position: number; is_published: boolean; contents: Content[] };

const materialId = (id: number) => 'material:' + id;
const contentId = (material: number, content: number) => 'content:' + material + ':' + content;
const parseContentId = (value: string) => {
    const [type, material, content] = value.split(':');
    if (type !== 'content' || !material || !content) return null;
    return { materialId: Number(material), contentId: Number(content) };
};

function SortableContent({ content, material }: { content: Content; material: number }) {
    const sortable = useSortable({ id: contentId(material, content.id) });
    const isVideo = content.type === 'video';
    return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={'bg-background flex items-start gap-3 rounded-lg border px-3 py-3 ' + (sortable.isDragging ? 'opacity-50 shadow-lg' : '')}>
        <Button type="button" variant="ghost" size="icon" className="mt-0.5 size-8 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing" aria-label={'Ubah urutan materi ' + content.title} {...sortable.attributes} {...sortable.listeners}><GripVertical className="size-4" /></Button>
        <span className="bg-muted text-muted-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-md">{isVideo ? <PlayCircle className="size-4" /> : <FileText className="size-4" />}</span>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{content.title}</p><Badge variant="outline" className="text-[11px]">{isVideo ? 'Video' : 'Textbook'}</Badge>{content.is_published ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Badge variant="secondary" className="text-[11px]">Draft</Badge>}</div>{content.description && <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{content.description}</p>}</div>
        {isVideo && content.video_duration_seconds && <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs"><Clock3 className="size-3.5" />{Math.floor(content.video_duration_seconds / 60)} menit</span>}
    </div>;
}

function SortableMaterial({ material, index, collapsed, onToggle }: { material: Material; index: number; collapsed: boolean; onToggle: () => void }) {
    const sortable = useSortable({ id: materialId(material.id) });
    return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={'rounded-xl border p-4 ' + (sortable.isDragging ? 'bg-background opacity-50 shadow-lg' : '')}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-1"><Button type="button" variant="ghost" size="icon" className="mt-0.5 size-8 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing" aria-label={'Ubah urutan modul ' + material.title} {...sortable.attributes} {...sortable.listeners}><GripVertical className="size-4" /></Button><div><p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">Modul {index + 1}</p><h2 className="mt-1 font-semibold">{material.title}</h2>{material.description && <p className="text-muted-foreground mt-1 text-sm">{material.description}</p>}</div></div><div className="flex items-center gap-2"><Badge variant="secondary">{material.contents.length} materi</Badge><Badge variant={material.is_published ? 'default' : 'outline'}>{material.is_published ? 'Terbit' : 'Draft'}</Badge><Button type="button" variant="ghost" size="icon" className="size-8" aria-expanded={!collapsed} aria-label={(collapsed ? 'Tampilkan' : 'Sembunyikan') + ' materi modul ' + material.title} title={collapsed ? 'Tampilkan materi' : 'Sembunyikan materi'} onClick={onToggle}>{collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}</Button></div></div>
        {!collapsed && <><Separator className="my-4" /><SortableContext items={material.contents.map((content) => contentId(material.id, content.id))} strategy={verticalListSortingStrategy}><div className="space-y-2">{material.contents.length ? material.contents.map((content) => <SortableContent key={content.id} content={content} material={material.id} />) : <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">Belum ada materi pada modul ini.</p>}</div></SortableContext></>}
    </div>;
}

export function SortableCurriculum({ courseId, initialMaterials }: { courseId: number; initialMaterials: Material[] }) {
    const [materials, setMaterials] = useState(initialMaterials);
    const [saving, setSaving] = useState(false);
    const [collapsedMaterials, setCollapsedMaterials] = useState<Set<number>>(new Set());
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    useEffect(() => setMaterials(initialMaterials), [initialMaterials]);
    const save = (next: Material[]) => { setSaving(true); router.put('/admin/courses/' + courseId + '/curriculum/order', { materials: next.map((material) => ({ id: material.id, contents: material.contents.map((content) => content.id) })) }, { preserveScroll: true, preserveState: true, onError: () => router.reload({ only: ['course'] }), onFinish: () => setSaving(false) }); };
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id || saving) return;
        const activeId = String(active.id); const overId = String(over.id); let next = materials;
        if (activeId.startsWith('material:') && overId.startsWith('material:')) {
            const from = materials.findIndex((item) => materialId(item.id) === activeId); const to = materials.findIndex((item) => materialId(item.id) === overId); if (from < 0 || to < 0) return; next = arrayMove(materials, from, to);
        } else {
            const fromContent = parseContentId(activeId); const toContent = parseContentId(overId); if (!fromContent || !toContent || fromContent.materialId !== toContent.materialId) return;
            next = materials.map((material) => { if (material.id !== fromContent.materialId) return material; const from = material.contents.findIndex((item) => item.id === fromContent.contentId); const to = material.contents.findIndex((item) => item.id === toContent.contentId); return from < 0 || to < 0 ? material : { ...material, contents: arrayMove(material.contents, from, to) }; });
        }
        setMaterials(next); save(next);
    };
    const toggleMaterial = (id: number) => setCollapsedMaterials((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={materials.map((material) => materialId(material.id))} strategy={verticalListSortingStrategy}><div className="space-y-4" aria-busy={saving}>{materials.length ? materials.map((material, index) => <SortableMaterial key={material.id} material={material} index={index} collapsed={collapsedMaterials.has(material.id)} onToggle={() => toggleMaterial(material.id)} />) : <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">Belum ada modul pembelajaran.</div>}</div></SortableContext></DndContext>;
}
