<?php

namespace App\Actions\Courses;

use App\Models\Course;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Support\TextbookHtmlSanitizer;
use App\Support\YouTubeVideo;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaveCourseBuilder
{
    /** @param array<int, array<string, mixed>> $materials */
    public function handle(Course $course, array $materials): void
    {
        DB::transaction(function () use ($course, $materials): void {
            $existingMaterialIds = $course->materials()->pluck('id')->all();
            $keptMaterialIds = [];

            foreach ($materials as $materialData) {
                $material = $this->material($course, $materialData, $existingMaterialIds);
                $keptMaterialIds[] = $material->id;
                $this->contents($material, $materialData['contents'] ?? []);
            }

            CourseMaterial::query()->where('course_id', $course->id)->whereNotIn('id', $keptMaterialIds)->delete();
        });
    }

    /** @param array<string, mixed> $data @param array<int, int> $existingMaterialIds */
    private function material(Course $course, array $data, array $existingMaterialIds): CourseMaterial
    {
        $id = $data['id'] ?? null;
        if ($id !== null && ! in_array($id, $existingMaterialIds, true)) {
            throw ValidationException::withMessages(['materials' => 'Invalid course material.']);
        }

        return $id === null
            ? $course->materials()->create($this->onlyMaterial($data))
            : tap(CourseMaterial::query()->findOrFail($id))->update($this->onlyMaterial($data));
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function onlyMaterial(array $data): array
    {
        return collect($data)->only(['title', 'description', 'position', 'is_published'])->all();
    }

    /** @param array<int, array<string, mixed>> $contents */
    private function contents(CourseMaterial $material, array $contents): void
    {
        $existing = $material->contents()->pluck('id')->all();
        $kept = [];

        foreach ($contents as $data) {
            $id = $data['id'] ?? null;
            if ($id !== null && ! in_array($id, $existing, true)) {
                throw ValidationException::withMessages(['materials' => 'Invalid learning content.']);
            }

            $payload = $this->contentPayload($data);
            $content = $id === null
                ? $material->contents()->create($payload)
                : tap(LearningContent::query()->findOrFail($id))->update($payload);
            $kept[] = $content->id;
        }

        LearningContent::query()->where('course_material_id', $material->id)->whereNotIn('id', $kept)->delete();
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function contentPayload(array $data): array
    {
        $payload = collect($data)->only(['type', 'title', 'description', 'position', 'is_published', 'attachment_url'])->all();

        if ($data['type'] === 'video') {
            if (empty($data['youtube_url'])) {
                throw ValidationException::withMessages(['youtube_url' => 'YouTube URL is required for video content.']);
            }
            $payload['youtube_url'] = $data['youtube_url'];
            $payload['youtube_video_id'] = YouTubeVideo::extractId($data['youtube_url']);
            $payload['textbook_content'] = null;
        } else {
            if (empty($data['textbook_content'])) {
                throw ValidationException::withMessages(['textbook_content' => 'Textbook content is required.']);
            }
            $payload['youtube_url'] = null;
            $payload['youtube_video_id'] = null;
            $payload['textbook_content'] = TextbookHtmlSanitizer::sanitize($data['textbook_content']);
        }

        return $payload;
    }
}
