<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\CourseStatus;
use App\Enums\EbookStatus;
use App\Enums\ProgressStatus;
use App\Models\CourseEnrollment;
use App\Models\Ebook;
use App\Models\Course;
use App\Models\LearningContentProgress;
use App\Models\User;

class StudentDashboardService
{
    public function data(User $student): array
    {
        $enrollments = CourseEnrollment::query()->where('user_id', $student->id);
        $total = (clone $enrollments)->count();
        $completed = (clone $enrollments)->where('status', EnrollmentStatus::Completed->value)->count();
        $enrolledCourseIds = (clone $enrollments)->pluck('course_id');

        return [
            'stats' => [
                'enrolled' => $total,
                'active' => (clone $enrollments)->whereIn('status', [EnrollmentStatus::Enrolled->value, EnrollmentStatus::InProgress->value])->count(),
                'completed' => $completed,
                'progress' => round((float) ((clone $enrollments)->avg('progress_percentage') ?? 0), 1),
            ],
            'activity' => $this->activity($student),
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
            'recommendations' => $this->recommendations($enrolledCourseIds),
            'ebooks' => $this->ebooks(),
        ];
    }

    private function activity(User $student): array
    {
        $start = now()->subDays(29)->startOfDay();

        $progress = LearningContentProgress::query()
            ->where('user_id', $student->id)
            ->whereBetween('last_viewed_at', [$start, now()])
            ->get(['status', 'last_viewed_at'])
            ->groupBy(fn (LearningContentProgress $item) => $item->last_viewed_at?->toDateString());

        return collect(range(0, 29))->map(function (int $offset) use ($start, $progress): array {
            $date = $start->copy()->addDays($offset);
            $items = $progress->get($date->toDateString(), collect());

            return ['date' => $date->format('M j'), 'studied' => $items->count(), 'completed' => $items->filter(fn (LearningContentProgress $item) => $item->status === ProgressStatus::Completed)->count()];
        })->all();
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

    private function recommendations($enrolledCourseIds): array
    {
        return Course::query()
            ->select(['id', 'course_category_id', 'title', 'slug', 'short_description', 'thumbnail_url', 'published_at'])
            ->with(['category:id,name', 'teachers:id,name'])
            ->withCount(['materials' => fn ($query) => $query->where('is_published', true)])
            ->where('status', CourseStatus::Published->value)
            ->whereNotIn('id', $enrolledCourseIds)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'thumbnail_url' => $course->thumbnail_url,
                'category' => $course->category?->name,
                'teacher' => $course->teachers->first()?->name,
                'materials_count' => $course->materials_count,
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
