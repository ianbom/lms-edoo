<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\EbookStatus;
use App\Enums\ProgressStatus;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
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
            'recentActivities' => $this->recentActivities($student),
            'enrollments' => (clone $enrollments)->with([
                'course:id,course_category_id,title,slug,short_description,thumbnail_url',
                'course.category:id,name',
                'course.teachers:id,name',
                'course.materials:id,course_id,is_published',
                'lastLearningContent:id,title',
            ])->orderByDesc('last_activity_at')->orderByDesc('enrolled_at')->limit(10)->get()->map(fn (CourseEnrollment $enrollment) => [
                'id' => $enrollment->id,
                'title' => $enrollment->course->title,
                'slug' => $enrollment->course->slug,
                'thumbnail_url' => $enrollment->course->thumbnail_url,
                'short_description' => $enrollment->course->short_description,
                'category' => $enrollment->course->category?->name,
                'teacher' => $enrollment->course->teachers->first()?->name,
                'materials_count' => $enrollment->course->materials->where('is_published', true)->count(),
                'status' => $enrollment->status->value,
                'progress' => (float) $enrollment->progress_percentage,
                'enrolled_at' => $enrollment->enrolled_at?->toDateString(),
                'last_activity_at' => $enrollment->last_activity_at?->toDateString(),
                'last_learning_content' => $enrollment->lastLearningContent?->title,
            ])->all(),
            'ebooks' => $this->ebooks(),
        ];
    }

    private function recentActivities(User $student): array
    {
        return LearningContentProgress::query()
            ->where('user_id', $student->id)
            ->with(['content:id,title', 'course:id,title'])
            ->whereNotNull('last_viewed_at')
            ->latest('last_viewed_at')
            ->limit(4)
            ->get()
            ->map(fn (LearningContentProgress $progress) => [
                'type' => $progress->status === ProgressStatus::Completed ? 'completed' : 'in_progress',
                'title' => $progress->status === ProgressStatus::Completed
                    ? "Menyelesaikan materi {$progress->content?->title}"
                    : "Mempelajari materi {$progress->content?->title}",
                'subtitle' => $progress->course?->title ?? 'Kelas online',
                'time' => $progress->last_viewed_at?->diffForHumans(),
            ])->all();
    }

    private function ebooks(): array
    {
        return Ebook::query()
            ->select(['id', 'ebook_category_id', 'title', 'slug', 'author', 'short_description', 'cover_url', 'file_url', 'total_pages', 'published_at'])
            ->with('category:id,name')
            ->where('status', EbookStatus::Published->value)
            ->whereNotNull('file_url')
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Ebook $ebook) => [
                'id' => $ebook->id,
                'title' => $ebook->title,
                'slug' => $ebook->slug,
                'author' => $ebook->author,
                'short_description' => $ebook->short_description,
                'cover_url' => $ebook->cover_url,
                'file_url' => $ebook->file_url,
                'total_pages' => $ebook->total_pages,
                'category' => $ebook->category?->name,
            ])->all();
    }
}
