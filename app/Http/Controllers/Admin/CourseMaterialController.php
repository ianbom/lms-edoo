<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CourseMaterialRequest;
use App\Models\CourseMaterial;
use App\Services\Admin\CourseMaterialService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseMaterialController extends Controller
{
    public function __construct(private CourseMaterialService $service) {}

    public function index(Request $request): Response
    {
        $filters = $request->validate(['search' => ['nullable', 'string', 'max:255']]);

        return Inertia::render('admin/course-materials/index', ['materials' => $this->service->paginate($filters), ...$this->service->options(), 'filters' => $filters]);
    }

    public function store(CourseMaterialRequest $request)
    {
        $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course material created.')]);

        return to_route('admin.course-materials.index');
    }

    public function update(CourseMaterialRequest $request, CourseMaterial $courseMaterial)
    {
        $this->service->update($request, $courseMaterial);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Course material updated.')]);

        return to_route('admin.course-materials.index');
    }
}
