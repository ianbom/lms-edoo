<?php

namespace App\Services\Admin;

use App\Enums\CourseStatus;
use App\Http\Requests\Admin\CourseRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Teacher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CourseService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Course::query()->with('category:id,name')->withCount(['materials', 'teachers', 'contents'])
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where('title', 'like', "%{$search}%"))
            ->when($filters['category'] ?? null, fn ($query, int $category) => $query->where('course_category_id', $category))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest('updated_at')->paginate(15)->withQueryString();
    }

    public function formOptions(): array
    {
        return ['categories' => CourseCategory::query()->orderBy('name')->get(['id', 'name']), 'teachers' => Teacher::query()->orderBy('name')->get(['id', 'name']), 'statuses' => array_column(CourseStatus::cases(), 'value')];
    }

    public function create(CourseRequest $request): Course
    {
        return DB::transaction(function () use ($request): Course {
            $course = new Course($this->data($request));
            $course->creator()->associate($request->user());
            $course->save();
            $this->syncTeachers($course, $request->validated('teacher_ids', []));

            return $course;
        });
    }

    public function update(CourseRequest $request, Course $course): void
    {
        DB::transaction(function () use ($request, $course): void {
            $course->update($this->data($request));
            $this->syncTeachers($course, $request->validated('teacher_ids', []));
        });
    }

    private function data(CourseRequest $request): array
    {
        $data = $request->safe()->except(['thumbnail', 'banner', 'teacher_ids']);
        foreach (['thumbnail', 'banner'] as $field) {
            if ($file = $request->file($field)) {
                $data["{$field}_url"] = Storage::disk('public')->url($file->store("courses/{$field}s", 'public'));
            }
        }
        if (($data['status'] ?? null) === CourseStatus::Published->value) {
            $data['published_at'] ??= now();
        }

        return $data;
    }

    private function syncTeachers(Course $course, array $ids): void
    {
        $course->teachers()->sync(collect($ids)->values()->mapWithKeys(fn (int $id, int $position) => [$id => ['position' => $position]])->all());
    }
}
