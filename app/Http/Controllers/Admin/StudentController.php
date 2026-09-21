<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Models\User;
use App\Services\Admin\StudentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(private StudentService $service) {}

    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'in:10,15,25'],
        ]);
        $filters['per_page'] = (int) ($filters['per_page'] ?? 15);

        return Inertia::render('admin/students/index', [
            'students' => $this->service->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function store(StudentRequest $request)
    {
        $this->service->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student created.')]);

        return to_route('admin.students.index');
    }

    public function progress(User $student)
    {
        abort_unless($student->role === UserRole::Student, 404);

        return Inertia::render('admin/students/progress', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
            ],
            'enrollments' => $this->service->progress($student),
        ]);
    }
}
