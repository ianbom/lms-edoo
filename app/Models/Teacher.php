<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'photo_url', 'expertise'])]
class Teacher extends Model
{
    use SoftDeletes;

    /** @return HasMany<CourseTeacher, $this> */
    public function courseTeachers(): HasMany
    {
        return $this->hasMany(CourseTeacher::class);
    }

    /** @return BelongsToMany<Course, $this> */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_teachers')
            ->withPivot('id', 'position')
            ->withTimestamps()
            ->orderByPivot('position');
    }
}
