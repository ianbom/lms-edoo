<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Services\Admin\CourseService;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function __construct(private CourseService $service) {}

    public function index(Request $request)
    {
        $filters = $request->validate(['search' => ['nullable', 'string', 'max:255'], 'category' => ['nullable', 'integer', 'exists:course_categories,id'], 'status' => ['nullable', 'string', 'in:draft,published,archived']]);

        return Inertia::render('admin/courses/index', ['courses' => $this->service->paginate($filters), 'categories' => CourseCategory::query()->orderBy('name')->get(['id', 'name']), 'statuses' => array_column(CourseStatus::cases(), 'value'), 'filters' => $filters]);
    }

    public function create()
    {
        return Inertia::render('admin/courses/create', $this->service->formOptions());
    }

    public function show(Course $course)
    {
        $course->load([
            'category:id,name',
            'creator:id,name',
            'teachers:id,name,photo_url,expertise',
            'materials' => fn ($query) => $query
                ->select('id', 'course_id', 'title', 'description', 'position', 'is_published')
                ->with([
                    'contents' => fn ($contentQuery) => $contentQuery->select(
                        'id',
                        'course_material_id',
                        'type',
                        'title',
                        'description',
                        'position',
                        'video_duration_seconds',
                        'is_published',
                    ),
                ]),
        ]);

        $contents = $course->materials->flatMap(
            fn ($material) => $material->contents,
        );

        return Inertia::render('admin/courses/show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'description' => $course->description,
                'thumbnail_url' => $course->thumbnail_url,
                'banner_url' => $course->banner_url,
                'level' => $course->level,
                'estimated_duration_minutes' => $course->estimated_duration_minutes,
                'status' => $course->status->value,
                'published_at' => $course->published_at?->toISOString(),
                'created_at' => $course->created_at?->toISOString(),
                'category' => $course->category,
                'creator' => $course->creator,
                'teachers' => $course->teachers,
                'materials' => $course->materials->map(fn ($material) => [
                    'id' => $material->id,
                    'title' => $material->title,
                    'description' => $material->description,
                    'position' => $material->position,
                    'is_published' => $material->is_published,
                    'contents' => $material->contents->map(fn ($content) => [
                        'id' => $content->id,
                        'type' => $content->type->value,
                        'title' => $content->title,
                        'description' => $content->description,
                        'position' => $content->position,
                        'video_duration_seconds' => $content->video_duration_seconds,
                        'is_published' => $content->is_published,
                    ])->values(),
                ])->values(),
                'statistics' => [
                    'materials' => $course->materials->count(),
                    'contents' => $contents->count(),
                    'videos' => $contents->filter(fn ($content) => $content->type->value === 'video')->count(),
                    'textbooks' => $contents->filter(fn ($content) => $content->type->value === 'textbook')->count(),
                    'enrollments' => $course->enrollments()->count(),
                ],
            ],
        ]);
    }

    public function reorderCurriculum(Request $request, Course $course): RedirectResponse
    {
        $data = $request->validate([
            'materials' => ['required', 'array'],
            'materials.*.id' => ['required', 'integer', 'distinct'],
            'materials.*.contents' => ['present', 'array'],
            'materials.*.contents.*' => ['integer', 'distinct'],
        ]);

        $materials = $course->materials()
            ->with('contents:id,course_material_id')
            ->get()
            ->keyBy('id');
        $submittedMaterials = collect($data['materials']);

        if ($submittedMaterials->count() !== $materials->count()
            || $submittedMaterials->pluck('id')->map(fn ($id) => (int) $id)->sort()->values()->all()
                !== $materials->keys()->map(fn ($id) => (int) $id)->sort()->values()->all()) {
            throw ValidationException::withMessages([
                'materials' => 'Urutan modul tidak valid.',
            ]);
        }

        foreach ($submittedMaterials as $submittedMaterial) {
            $material = $materials->get((int) $submittedMaterial['id']);
            $submittedContents = collect($submittedMaterial['contents'])
                ->map(fn ($id) => (int) $id);
            $contentIds = $material->contents->pluck('id')->map(fn ($id) => (int) $id);

            if ($submittedContents->count() !== $contentIds->count()
                || $submittedContents->sort()->values()->all() !== $contentIds->sort()->values()->all()) {
                throw ValidationException::withMessages([
                    'materials' => 'Urutan materi tidak valid.',
                ]);
            }
        }

        app(DatabaseManager::class)->transaction(function () use ($submittedMaterials, $materials): void {
            foreach ($submittedMaterials->values() as $materialPosition => $submittedMaterial) {
                $material = $materials->get((int) $submittedMaterial['id']);
                $material->update(['position' => $materialPosition]);

                foreach (collect($submittedMaterial['contents'])->values() as $contentPosition => $contentId) {
                    $material->contents()->whereKey((int) $contentId)->update([
                        'position' => $contentPosition,
                    ]);
                }
            }
        });

        return back();
    }

    public function store(CourseRequest $request)
    {
        $course = $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course created.')]);

        return to_route('admin.courses.builder', $course);
    }

    public function edit(Course $course)
    {
        return Inertia::render('admin/courses/edit', ['course' => $course->load('teachers:id,name'), ...$this->service->formOptions()]);
    }

    public function update(CourseRequest $request, Course $course)
    {
        $this->service->update($request, $course);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course updated.')]);

        return to_route('admin.courses.index');
    }

    public function destroy(Course $course)
    {
        $course->delete();

        return to_route('admin.courses.index');
    }
}
