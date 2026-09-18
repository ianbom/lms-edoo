<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Services\Admin\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function __construct(private CourseService $service) {}

    public function index(Request $request)
    {
        $filters = $request->validate(['search' => ['nullable', 'string', 'max:255'], 'category' => ['nullable', 'integer', 'exists:course_categories,id'], 'status' => ['nullable', 'string', 'in:draft,published,archived']]);

        return Inertia::render('admin/courses/index', ['courses' => $this->service->paginate($filters), 'categories' => CourseCategory::query()->orderBy('name')->get(['id', 'name']), 'statuses' => array_column(CourseStatus::cases(), 'value'), 'filters' => $filters]);
    }

    public function create()
    {
        return Inertia::render('admin/courses/create', $this->service->formOptions());
    }

    public function store(CourseRequest $request)
    {
        $course = $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course created.')]);

        return to_route('admin.courses.builder', $course);
    }

    public function edit(Course $course)
    {
        return Inertia::render('admin/courses/edit', ['course' => $course->load('teachers:id,name'), ...$this->service->formOptions()]);
    }

    public function update(CourseRequest $request, Course $course)
    {
        $this->service->update($request, $course);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course updated.')]);

        return to_route('admin.courses.index');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return to_route('admin.courses.index');
    }
}
