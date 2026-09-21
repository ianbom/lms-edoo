<?php

namespace App\Http\Controllers;

use App\Enums\ContentType;
use App\Enums\CourseStatus;
use App\Http\Requests\CourseCatalogRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class CourseCatalogController extends Controller
{
    public function __invoke(CourseCatalogRequest $request): Response
    {
        $filters = $request->validated();
        $published = CourseStatus::Published->value;

        $courses = Course::query()
            ->select(['id', 'course_category_id', 'title', 'slug', 'short_description', 'thumbnail_url', 'published_at'])
            ->with('category:id,name,slug')
            ->withCount([
                'contents as videos_count' => fn (Builder $query) => $query
                    ->where('learning_contents.type', ContentType::Video->value)
                    ->where('learning_contents.is_published', true)
                    ->whereHas('material', fn (Builder $material) => $material->where('is_published', true)),
                'enrollments',
            ])
            ->where('status', $published)
            ->when($filters['search'] ?? null, fn (Builder $query, string $search) => $query
                ->where(fn (Builder $course) => $course
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")))
            ->when($filters['category'] ?? null, fn (Builder $query, string $category) => $query
                ->whereHas('category', fn (Builder $categoryQuery) => $categoryQuery->where('slug', $category)))
            ->latest('published_at')
            ->get();

        $categories = CourseCategory::query()
            ->whereHas('courses', fn (Builder $query) => $query->where('status', $published))
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('home/courses/index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? '',
            ],
        ]);
    }
}
