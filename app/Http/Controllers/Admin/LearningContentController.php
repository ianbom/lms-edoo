<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LearningContentRequest;
use App\Models\LearningContent;
use App\Services\Admin\LearningContentService;
use Inertia\Inertia;
use Inertia\Response;

class LearningContentController extends Controller
{
    public function __construct(private LearningContentService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/learning-contents/index', ['contents' => $this->service->paginate(), ...$this->service->options()]);
    }

    public function store(LearningContentRequest $request)
    {
        $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Learning content created.')]);

        return to_route('admin.learning-contents.index');
    }

    public function update(LearningContentRequest $request, LearningContent $learningContent)
    {
        $this->service->update($request, $learningContent);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Learning content updated.')]);

        return to_route('admin.learning-contents.index');
    }
}
