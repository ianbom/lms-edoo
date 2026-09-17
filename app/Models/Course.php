<?php

namespace App\Models;

use App\Enums\CourseStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'course_category_id',
    'title',
    'slug',
    'short_description',
    'description',
    'thumbnail_url',
    'banner_url',
    'level',
    'estimated_duration_minutes',
    'status',
    'published_at',
])]
class Course extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'status' => CourseStatus::class,
            'estimated_duration_minutes' => 'integer',
            'published_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<CourseCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'course_category_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<CourseTeacher, $this> */
    public function courseTeachers(): HasMany
    {
        return $this->hasMany(CourseTeacher::class);
    }

    /** @return BelongsToMany<Teacher, $this> */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class, 'course_teachers')
            ->withPivot('id', 'position')
            ->withTimestamps()
            ->orderByPivot('position');
    }

    /** @return HasMany<CourseMaterial, $this> */
    public function materials(): HasMany
    {
        return $this->hasMany(CourseMaterial::class)->orderBy('position');
    }

    /** @return HasMany<CourseEnrollment, $this> */
    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    /** @return HasMany<LearningContentProgress, $this> */
    public function learningContentProgress(): HasMany
    {
        return $this->hasMany(LearningContentProgress::class);
    }

    /** @return HasMany<CourseMaterialProgress, $this> */
    public function courseMaterialProgress(): HasMany
    {
        return $this->hasMany(CourseMaterialProgress::class);
    }
}
