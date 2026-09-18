<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EbookCategoryRequest;
use App\Models\EbookCategory;
use App\Services\Admin\EbookCategoryService;
use Inertia\Inertia;

class EbookCategoryController extends Controller
{
    public function __construct(private EbookCategoryService $service) {}

    public function index()
    {
        return Inertia::render('admin/ebook-categories/index', ['categories' => $this->service->all()]);
    }

    public function store(EbookCategoryRequest $request)
    {
        $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook category created.')]);

        return to_route('admin.ebook-categories.index');
    }

    public function update(EbookCategoryRequest $request, EbookCategory $ebookCategory)
    {
        $this->service->update($request, $ebookCategory);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook category updated.')]);

        return to_route('admin.ebook-categories.index');
    }

    public function destroy(EbookCategory $ebookCategory)
    {
        $deleted = $this->service->delete($ebookCategory);
        Inertia::flash('toast', ['type' => $deleted ? 'success' : 'error', 'message' => $deleted ? __('Ebook category deleted.') : __('Ebook categories in use cannot be deleted.')]);

        return to_route('admin.ebook-categories.index');
    }
}
