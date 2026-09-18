<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\ProgressStatus;
use App\Models\CourseEnrollment;
use App\Models\LearningContentProgress;
use App\Models\User;

class StudentDashboardService
{
    public function data(User $student): array
    {
        $enrollments = CourseEnrollment::query()->where('user_id', $student->id);
        $total = (clone $enrollments)->count();
        $completed = (clone $enrollments)->where('status', EnrollmentStatus::Completed->value)->count();

        return [
            'stats' => [
                'enrolled' => $total,
                'active' => (clone $enrollments)->whereIn('status', [EnrollmentStatus::Enrolled->value, EnrollmentStatus::InProgress->value])->count(),
                'completed' => $completed,
                'progress' => round((float) ((clone $enrollments)->avg('progress_percentage') ?? 0), 1),
            ],
            'activity' => $this->activity($student),
            'enrollments' => (clone $enrollments)->with('course:id,title,slug,thumbnail_url')->orderByDesc('last_activity_at')->orderByDesc('enrolled_at')->limit(10)->get()->map(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'title' => $enrollment->course->title,
                'slug' => $enrollment->course->slug,
                'thumbnail_url' => $enrollment->course->thumbnail_url,
                'status' => $enrollment->status->value,
                'progress' => (float) $enrollment->progress_percentage,
                'enrolled_at' => $enrollment->enrolled_at?->toDateString(),
                'last_activity_at' => $enrollment->last_activity_at?->toDateString(),
            ])->all(),
        ];
    }

    private function activity(User $student): array
    {
        $start = now()->subDays(29)->startOfDay();

        return collect(range(0, 29))->map(function (int $offset) use ($start, $student): array {
            $date = $start->copy()->addDays($offset);
            $progress = LearningContentProgress::query()->where('user_id', $student->id)->whereDate('last_viewed_at', $date)->get(['status']);

            return ['date' => $date->format('M j'), 'studied' => $progress->count(), 'completed' => $progress->where('status', ProgressStatus::Completed)->count()];
        })->all();
    }
}
