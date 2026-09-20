<?php

namespace App\Services;

use App\Enums\CourseStatus;
use App\Models\CourseEnrollment;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StudentClassService
{
    public function paginate(User $student): LengthAwarePaginator
    {
        return CourseEnrollment::query()
            ->where('user_id', $student->id)
            ->with([
                'course' => fn ($query) => $query
                    ->with(['category:id,name', 'teachers:id,name'])
                    ->withCount(['materials', 'contents']),
            ])
            ->orderByDesc('last_activity_at')
            ->orderByDesc('enrolled_at')
            ->paginate(12)
            ->through(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'status' => $enrollment->status->value,
                'progress' => (float) $enrollment->progress_percentage,
                'enrolled_at' => $enrollment->enrolled_at?->toDateString(),
                'last_activity_at' => $enrollment->last_activity_at?->toDateString(),
                'course' => [
                    'id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                    'slug' => $enrollment->course->slug,
                    'thumbnail_url' => $enrollment->course->thumbnail_url,
                    'short_description' => $enrollment->course->short_description,
                    'category' => $enrollment->course->category?->name,
                    'teacher' => $enrollment->course->teachers->first()?->name,
                    'materials_count' => $enrollment->course->materials_count,
                    'contents_count' => $enrollment->course->contents_count,
                ],
                'available' => $enrollment->course->status === CourseStatus::Published,
            ]);
    }
}
