<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EbookCategoryRequest;
use App\Models\EbookCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EbookCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/ebook-categories/index', [
            'categories' => EbookCategory::query()
                ->withCount('ebooks')
                ->orderBy('position')
                ->latest('updated_at')
                ->get([
                    'id',
                    'name',
                    'slug',
                    'description',
                    'icon',
                    'thumbnail_url',
                    'is_active',
                    'position',
                    'updated_at',
                ]),
        ]);
    }

    public function store(EbookCategoryRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('thumbnail');

        if ($thumbnail = $request->file('thumbnail')) {
            $path = $thumbnail->store('ebook-categories/thumbnails', 'public');
            $data['thumbnail_url'] = Storage::disk('public')->url($path);
        }

        EbookCategory::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook category created.')]);

        return to_route('admin.ebook-categories.index');
    }

    public function update(EbookCategoryRequest $request, EbookCategory $ebookCategory): RedirectResponse
    {
        $data = $request->safe()->except('thumbnail');

        if ($thumbnail = $request->file('thumbnail')) {
            $path = $thumbnail->store('ebook-categories/thumbnails', 'public');
            $data['thumbnail_url'] = Storage::disk('public')->url($path);
        }

        $ebookCategory->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook category updated.')]);

        return to_route('admin.ebook-categories.index');
    }

    public function destroy(EbookCategory $ebookCategory): RedirectResponse
    {
        if ($ebookCategory->ebooks()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Ebook categories in use cannot be deleted.'),
            ]);

            return to_route('admin.ebook-categories.index');
        }

        $ebookCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook category deleted.')]);

        return to_route('admin.ebook-categories.index');
    }
}
