<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StudentRequest;
use App\Services\Admin\StudentService;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function __construct(private StudentService $service) {}

    public function index()
    {
        return Inertia::render('admin/students/index', ['students' => $this->service->paginate()]);
    }

    public function store(StudentRequest $request)
    {
        $this->service->create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Student created.')]);

        return to_route('admin.students.index');
    }
}
