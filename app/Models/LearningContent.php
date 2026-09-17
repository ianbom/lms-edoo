<?php

namespace App\Models;

use App\Enums\ContentType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'course_material_id',
    'type',
    'title',
    'description',
    'position',
    'youtube_url',
    'youtube_video_id',
    'video_duration_seconds',
    'textbook_content',
    'attachment_url',
    'is_published',
])]
class LearningContent extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'type' => ContentType::class,
            'position' => 'integer',
            'video_duration_seconds' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /** @return BelongsTo<CourseMaterial, $this> */
    public function material(): BelongsTo
    {
        return $this->belongsTo(CourseMaterial::class, 'course_material_id');
    }

    /** @return HasMany<CourseEnrollment, $this> */
    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class, 'last_learning_content_id');
    }

    /** @return HasMany<LearningContentProgress, $this> */
    public function progress(): HasMany
    {
        return $this->hasMany(LearningContentProgress::class);
    }
}
