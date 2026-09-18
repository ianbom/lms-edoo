<?php

namespace App\Services\Admin;

use App\Models\CourseCategory;

class CourseCategoryService
{
    public function all()
    {
        return CourseCategory::query()->withCount('courses')->latest('updated_at')->get(['id', 'name', 'slug', 'description', 'updated_at']);
    }

    public function create(array $data): void
    {
        CourseCategory::create($data);
    }

    public function update(CourseCategory $model, array $data): void
    {
        $model->update($data);
    }

    public function delete(CourseCategory $model): bool
    {
        if ($model->courses()->exists()) {
            return false;
        } $model->delete();

        return true;
    }
}
