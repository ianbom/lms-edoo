<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/students/index', [
            'students' => User::query()
                ->where('role', UserRole::Student)
                ->withCount('enrollments')
                ->withCount([
                    'enrollments as completed_courses_count' => fn ($query) => $query
                        ->where('status', EnrollmentStatus::Completed),
                ])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(StudentRequest $request): RedirectResponse
    {
        User::create([
            ...$request->validated(),
            'role' => UserRole::Student,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student created.')]);

        return to_route('admin.students.index');
    }
}
