<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\TeacherRequest;
use App\Models\Teacher;
use Illuminate\Support\Facades\Storage;

class TeacherService
{
    public function paginate()
    {
        return Teacher::query()->withCount('courses')->latest('updated_at')->paginate(15);
    }

    public function create(TeacherRequest $request): void
    {
        Teacher::create($this->data($request));
    }

    public function update(TeacherRequest $request, Teacher $model): void
    {
        $model->update($this->data($request));
    }

    private function data(TeacherRequest $request): array
    {
        $data = $request->safe()->except('photo');
        if ($file = $request->file('photo')) {
            $data['photo_url'] = Storage::disk('public')->url($file->store('teachers/photos', 'public'));
        }

return $data;
    }
}
