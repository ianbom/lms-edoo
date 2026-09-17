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
    'status',
    'total_contents',
    'completed_contents',
    'progress_percentage',
    'started_at',
    'completed_at',
    'last_activity_at',
])]
class CourseMaterialProgress extends Model
{
    protected function casts(): array
    {
        return [
            'status' => ProgressStatus::class,
            'total_contents' => 'integer',
            'completed_contents' => 'integer',
            'progress_percentage' => 'decimal:2',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'last_activity_at' => 'datetime',
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
}
