<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EbookRequest;
use App\Models\Ebook;
use App\Services\Admin\EbookService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EbookController extends Controller
{
    public function __construct(private EbookService $service) {}

    public function index(Request $request)
    {
        $filters = $request->validate(['search' => ['nullable', 'string', 'max:255'], 'category' => ['nullable', 'integer', 'exists:ebook_categories,id'], 'status' => ['nullable', 'string', 'in:draft,published,archived']]);

        return Inertia::render('admin/ebooks/index', ['ebooks' => $this->service->paginate($filters), ...$this->service->options(), 'filters' => $filters]);
    }

    public function store(EbookRequest $request)
    {
        $this->service->create($request);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook created.')]);

        return to_route('admin.ebooks.index');
    }

    public function update(EbookRequest $request, Ebook $ebook)
    {
        $this->service->update($request, $ebook);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook updated.')]);

        return to_route('admin.ebooks.index');
    }

    public function destroy(Ebook $ebook)
    {
        $ebook->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook deleted.')]);

        return to_route('admin.ebooks.index');
    }
}
