<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseCategoryRequest;
use App\Models\CourseCategory;
use App\Services\Admin\CourseCategoryService;
use Inertia\Inertia;

class CourseCategoryController extends Controller
{
    public function __construct(private CourseCategoryService $service) {}

    public function index()
    {
        return Inertia::render('admin/course-categories/index', ['categories' => $this->service->all()]);
    }

    public function store(CourseCategoryRequest $request)
    {
        $this->service->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course category created.')]);

        return to_route('admin.course-categories.index');
    }

    public function update(CourseCategoryRequest $request, CourseCategory $courseCategory)
    {
        $this->service->update($courseCategory, $request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course category updated.')]);

        return to_route('admin.course-categories.index');
    }

    public function destroy(CourseCategory $courseCategory)
    {
        $deleted = $this->service->delete($courseCategory);
        Inertia::flash('toast', ['type' => $deleted ? 'success' : 'error', 'message' => $deleted ? __('Course category deleted.') : __('Course categories in use cannot be deleted.')]);

        return to_route('admin.course-categories.index');
    }
}
