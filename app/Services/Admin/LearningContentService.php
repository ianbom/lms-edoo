<?php

namespace App\Services\Admin;

use App\Enums\ContentType;
use App\Http\Requests\Admin\LearningContentRequest;
use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Support\TextbookHtmlSanitizer;
use App\Support\YouTubeVideo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LearningContentService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return LearningContent::query()
            ->with('material.course:id,title')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($query) => $query
                ->where('title', 'like', "%{$search}%")
                ->orWhereHas('material', fn ($query) => $query
                    ->where('title', 'like', "%{$search}%")
                    ->orWhereHas('course', fn ($query) => $query->where('title', 'like', "%{$search}%")))))
            ->when($filters['course_id'] ?? null, fn ($query, int $courseId) => $query->whereHas('material', fn ($query) => $query->where('course_id', $courseId)))
            ->when($filters['course_material_id'] ?? null, fn ($query, int $materialId) => $query->where('course_material_id', $materialId))
            ->orderByDesc('updated_at')
            ->paginate($filters['per_page'] ?? 15)
            ->withQueryString();
    }

    public function options(): array
    {
        return [
            'courses' => Course::query()->orderBy('title')->get(['id', 'title']),
            'materials' => CourseMaterial::query()->with('course:id,title')->orderBy('title')->get(['id', 'course_id', 'title']),
            'types' => array_column(ContentType::cases(), 'value'),
        ];
    }

    public function create(LearningContentRequest $request): void
    {
        LearningContent::query()->create($this->data($request));
    }

    public function update(LearningContentRequest $request, LearningContent $learningContent): void
    {
        $learningContent->update($this->data($request));
    }

    private function data(LearningContentRequest $request): array
    {
        $data = $request->validated();

        if ($data['type'] === ContentType::Video->value) {
            $data['youtube_video_id'] = YouTubeVideo::extractId($data['youtube_url']);
            $data['textbook_content'] = null;
        } else {
            $data['youtube_url'] = null;
            $data['youtube_video_id'] = null;
            $data['textbook_content'] = TextbookHtmlSanitizer::sanitize($data['textbook_content']);
        }

        return $data;
    }
}
