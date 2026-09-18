<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeacherRequest;
use App\Models\Teacher;
use App\Services\Admin\TeacherService;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function __construct(private TeacherService $service) {}

    public function index()
    {
        return Inertia::render('admin/teachers/index', ['teachers' => $this->service->paginate()]);
    }

    public function store(TeacherRequest $request)
    {
        $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Teacher created.')]);

        return to_route('admin.teachers.index');
    }

    public function update(TeacherRequest $request, Teacher $teacher)
    {
        $this->service->update($request, $teacher);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Teacher updated.')]);

        return to_route('admin.teachers.index');
    }
}
