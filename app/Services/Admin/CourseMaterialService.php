<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\CourseMaterialRequest;
use App\Models\Course;
use App\Models\CourseMaterial;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CourseMaterialService
{
    public function paginate(): LengthAwarePaginator
    {
        return CourseMaterial::query()
            ->with('course:id,title')
            ->withCount('contents')
            ->orderByDesc('updated_at')
            ->paginate(15);
    }

    public function options(): array
    {
        return ['courses' => Course::query()->orderBy('title')->get(['id', 'title'])];
    }

    public function create(CourseMaterialRequest $request): void
    {
        CourseMaterial::query()->create($request->validated());
    }

    public function update(CourseMaterialRequest $request, CourseMaterial $courseMaterial): void
    {
        $courseMaterial->update($request->validated());
    }
}
