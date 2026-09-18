<?php

namespace App\Services\Admin;

use App\Enums\ContentType;
use App\Http\Requests\Admin\LearningContentRequest;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Support\TextbookHtmlSanitizer;
use App\Support\YouTubeVideo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LearningContentService
{
    public function paginate(): LengthAwarePaginator
    {
        return LearningContent::query()
            ->with('material.course:id,title')
            ->orderByDesc('updated_at')
            ->paginate(15);
    }

    public function options(): array
    {
        return [
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
