<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'course_id',
    'status',
    'progress_percentage',
    'last_learning_content_id',
    'enrolled_at',
    'started_at',
    'completed_at',
    'last_activity_at',
])]
class CourseEnrollment extends Model
{
    protected function casts(): array
    {
        return [
            'status' => EnrollmentStatus::class,
            'progress_percentage' => 'decimal:2',
            'enrolled_at' => 'datetime',
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

    /** @return BelongsTo<LearningContent, $this> */
    public function lastLearningContent(): BelongsTo
    {
        return $this->belongsTo(LearningContent::class, 'last_learning_content_id');
    }
}
