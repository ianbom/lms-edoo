<?php

namespace App\Http\Controllers;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourseEnrollmentController extends Controller
{
    public function __invoke(Request $request, Course $course): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Student, 403);
        abort_unless($course->status === CourseStatus::Published, 404);

        $request->user()->enrollments()->firstOrCreate(
            ['course_id' => $course->id],
            [
                'status' => EnrollmentStatus::Enrolled,
                'progress_percentage' => 0,
                'enrolled_at' => now(),
            ],
        );

        return to_route('student.classes.index');
    }
}
