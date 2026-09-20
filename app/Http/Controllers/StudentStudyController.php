<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LearningContent;
use App\Services\StudentStudyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentStudyController extends Controller
{
    public function __construct(private StudentStudyService $service) {}

    public function show(Request $request, Course $course, ?LearningContent $content = null): Response
    {
        return Inertia::render('student/class/study', $this->service->data($request->user(), $course, $content));
    }

    public function complete(Request $request, Course $course, LearningContent $content): RedirectResponse
    {
        $this->service->complete($request->user(), $course, $content);

        return to_route('student.classes.study', ['course' => $course->slug, 'content' => $content->id]);
    }
}
