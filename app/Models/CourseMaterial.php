<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['course_id', 'title', 'description', 'position', 'is_published'])]
class CourseMaterial extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /** @return BelongsTo<Course, $this> */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /** @return HasMany<LearningContent, $this> */
    public function contents(): HasMany
    {
        return $this->hasMany(LearningContent::class)->orderBy('position');
    }

    /** @return HasMany<CourseMaterialProgress, $this> */
    public function progress(): HasMany
    {
        return $this->hasMany(CourseMaterialProgress::class);
    }

    /** @return HasMany<LearningContentProgress, $this> */
    public function contentProgress(): HasMany
    {
        return $this->hasMany(LearningContentProgress::class);
    }
}
