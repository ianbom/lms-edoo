<?php

namespace App\Services\Admin;

use App\Enums\EbookStatus;
use App\Http\Requests\Admin\EbookRequest;
use App\Models\Ebook;
use App\Models\EbookCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class EbookService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Ebook::query()->with('category:id,name')->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($query) => $query->where('title', 'like', "%{$search}%")->orWhere('author', 'like', "%{$search}%")))->when($filters['category'] ?? null, fn ($query, int $category) => $query->where('ebook_category_id', $category))->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))->latest('updated_at')->paginate(15)->withQueryString();
    }

    public function options(): array
    {
        return ['categories' => EbookCategory::query()->orderBy('position')->orderBy('name')->get(['id', 'name']), 'statuses' => array_column(EbookStatus::cases(), 'value')];
    }

    public function create(EbookRequest $request): void
    {
        $ebook = new Ebook($this->data($request));
        $ebook->creator()->associate($request->user());
        $ebook->save();
    }

    public function update(EbookRequest $request, Ebook $ebook): void
    {
        $ebook->update($this->data($request, $ebook));
    }

    private function data(EbookRequest $request, ?Ebook $ebook = null): array
    {
        $data = $request->safe()->except(['cover', 'file']);
        if ($cover = $request->file('cover')) {
            $data['cover_url'] = Storage::disk('public')->url($cover->store('ebooks/covers', 'public'));
        }
        if ($file = $request->file('file')) {
            $path = $file->store('ebooks/files', 'public');
            $data += ['file_url' => Storage::disk('public')->url($path), 'file_name' => $file->getClientOriginalName(), 'file_type' => $file->getMimeType(), 'file_size' => $file->getSize()];
        }
        if (($data['status'] ?? null) === EbookStatus::Published->value) {
            $data['published_at'] ??= $ebook?->published_at ?? now();
        }

        return $data;
    }
}
