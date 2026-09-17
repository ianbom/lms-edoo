<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TeacherRequest;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/teachers/index', [
            'teachers' => Teacher::query()
                ->withCount('courses')
                ->latest('updated_at')
                ->paginate(15),
        ]);
    }

    public function store(TeacherRequest $request): RedirectResponse
    {
        Teacher::create($this->dataWithPhoto($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Teacher created.')]);

        return to_route('admin.teachers.index');
    }

    public function update(TeacherRequest $request, Teacher $teacher): RedirectResponse
    {
        $teacher->update($this->dataWithPhoto($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Teacher updated.')]);

        return to_route('admin.teachers.index');
    }

    /** @return array<string, mixed> */
    private function dataWithPhoto(TeacherRequest $request): array
    {
        $data = $request->safe()->except('photo');

        if ($photo = $request->file('photo')) {
            $path = $photo->store('teachers/photos', 'public');
            $data['photo_url'] = Storage::disk('public')->url($path);
        }

        return $data;
    }
}
