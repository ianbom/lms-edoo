<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveCourseBuilderRequest;
use App\Models\Course;
use App\Services\Admin\CourseBuilderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseBuilderController extends Controller
{
    public function __construct(private CourseBuilderService $service) {}

    public function show(Course $course): Response
    {
        return Inertia::render('admin/courses/builder', [
            'course' => $this->service->load($course),
        ]);
    }

    public function update(
        SaveCourseBuilderRequest $request,
        Course $course,
    ): RedirectResponse {
        $this->service->save($course, $request->validated('materials'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course builder saved.')]);

        return to_route('admin.courses.builder', $course);
    }
}
