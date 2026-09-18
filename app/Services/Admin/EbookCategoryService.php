<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\EbookCategoryRequest;
use App\Models\EbookCategory;
use Illuminate\Support\Facades\Storage;

class EbookCategoryService
{
    public function all()
    {
        return EbookCategory::query()->withCount('ebooks')->orderBy('position')->latest('updated_at')->get();
    }

    public function create(EbookCategoryRequest $request): void
    {
        EbookCategory::create($this->data($request));
    }

    public function update(EbookCategoryRequest $request, EbookCategory $model): void
    {
        $model->update($this->data($request));
    }

    public function delete(EbookCategory $model): bool
    {
        if ($model->ebooks()->exists()) {
            return false;
        } $model->delete();

        return true;
    }

    private function data(EbookCategoryRequest $request): array
    {
        $data = $request->safe()->except('thumbnail');
        if ($file = $request->file('thumbnail')) {
            $data['thumbnail_url'] = Storage::disk('public')->url($file->store('ebook-categories/thumbnails', 'public'));
        }

return $data;
    }
}
