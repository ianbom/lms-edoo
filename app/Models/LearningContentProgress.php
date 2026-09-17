<?php

namespace App\Models;

use App\Enums\ProgressStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'course_id',
    'course_material_id',
    'learning_content_id',
    'status',
    'watched_seconds',
    'progress_percentage',
    'first_viewed_at',
    'last_viewed_at',
    'completed_at',
])]
class LearningContentProgress extends Model
{
    protected function casts(): array
    {
        return [
            'status' => ProgressStatus::class,
            'watched_seconds' => 'integer',
            'progress_percentage' => 'decimal:2',
            'first_viewed_at' => 'datetime',
            'last_viewed_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Course, $this> */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /** @return BelongsTo<CourseMaterial, $this> */
    public function material(): BelongsTo
    {
        return $this->belongsTo(CourseMaterial::class, 'course_material_id');
    }

    /** @return BelongsTo<LearningContent, $this> */
    public function content(): BelongsTo
    {
        return $this->belongsTo(LearningContent::class, 'learning_content_id');
    }
}
