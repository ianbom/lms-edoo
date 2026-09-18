<?php

namespace App\Services\Admin;

use App\Http\Requests\Admin\CourseMaterialRequest;
use App\Models\Course;
use App\Models\CourseMaterial;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CourseMaterialService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return CourseMaterial::query()
            ->with('course:id,title')
            ->withCount('contents')
            ->when($filters['search'] ?? null, fn ($query, string $search) => $query->where(fn ($query) => $query
                ->where('title', 'like', "%{$search}%")
                ->orWhereHas('course', fn ($query) => $query->where('title', 'like', "%{$search}%"))))
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();
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
