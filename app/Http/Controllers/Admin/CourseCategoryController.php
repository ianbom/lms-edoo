<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseCategoryRequest;
use App\Models\CourseCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/course-categories/index', [
            'categories' => CourseCategory::query()
                ->withCount('courses')
                ->latest('updated_at')
                ->get(['id', 'name', 'slug', 'description', 'updated_at']),
        ]);
    }

    public function store(CourseCategoryRequest $request): RedirectResponse
    {
        CourseCategory::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course category created.')]);

        return to_route('admin.course-categories.index');
    }

    public function update(CourseCategoryRequest $request, CourseCategory $courseCategory): RedirectResponse
    {
        $courseCategory->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course category updated.')]);

        return to_route('admin.course-categories.index');
    }

    public function destroy(CourseCategory $courseCategory): RedirectResponse
    {
        if ($courseCategory->courses()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Course categories in use cannot be deleted.'),
            ]);

            return to_route('admin.course-categories.index');
        }

        $courseCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course category deleted.')]);

        return to_route('admin.course-categories.index');
    }
}
