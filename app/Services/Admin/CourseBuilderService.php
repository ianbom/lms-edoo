<?php

namespace App\Services\Admin;

use App\Actions\Courses\SaveCourseBuilder;
use App\Models\Course;

class CourseBuilderService
{
    public function __construct(private SaveCourseBuilder $save) {}

    public function load(Course $course): Course
    {
        return $course->load(['teachers:id,name', 'materials.contents']);
    }

    public function save(Course $course, array $materials): void
    {
        $this->save->handle($course, $materials);
    }
}
