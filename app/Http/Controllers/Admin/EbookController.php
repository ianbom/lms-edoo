<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EbookStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EbookRequest;
use App\Models\Ebook;
use App\Models\EbookCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EbookController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'integer', 'exists:ebook_categories,id'],
            'status' => ['nullable', 'string', 'in:draft,published,archived'],
        ]);

        return Inertia::render('admin/ebooks/index', [
            'ebooks' => Ebook::query()
                ->with('category:id,name')
                ->when($filters['search'] ?? null, function ($query, string $search): void {
                    $query->where(function ($query) use ($search): void {
                        $query->where('title', 'like', "%{$search}%")
                            ->orWhere('author', 'like', "%{$search}%");
                    });
                })
                ->when($filters['category'] ?? null, fn ($query, int $category): mixed => $query->where('ebook_category_id', $category))
                ->when($filters['status'] ?? null, fn ($query, string $status): mixed => $query->where('status', $status))
                ->latest('updated_at')
                ->paginate(15)
                ->withQueryString(),
            'categories' => EbookCategory::query()
                ->orderBy('position')
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => isset($filters['category']) ? (string) $filters['category'] : '',
                'status' => $filters['status'] ?? '',
            ],
            'statuses' => array_map(
                fn (EbookStatus $status): string => $status->value,
                EbookStatus::cases(),
            ),
        ]);
    }

    public function store(EbookRequest $request): RedirectResponse
    {
        $data = $this->dataWithUploads($request, $request->safe()->except(['cover', 'file']));
        $this->setPublishedAt($data);

        $ebook = new Ebook($data);
        $ebook->creator()->associate($request->user());
        $ebook->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook created.')]);

        return to_route('admin.ebooks.index');
    }

    public function update(EbookRequest $request, Ebook $ebook): RedirectResponse
    {
        $data = $this->dataWithUploads($request, $request->safe()->except(['cover', 'file']));
        $this->setPublishedAt($data, $ebook);

        $ebook->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook updated.')]);

        return to_route('admin.ebooks.index');
    }

    public function destroy(Ebook $ebook): RedirectResponse
    {
        $ebook->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Ebook deleted.')]);

        return to_route('admin.ebooks.index');
    }

    /** @param array<string, mixed> $data
     *  @return array<string, mixed>
     */
    private function dataWithUploads(EbookRequest $request, array $data): array
    {
        if ($cover = $request->file('cover')) {
            $path = $cover->store('ebooks/covers', 'public');
            $data['cover_url'] = Storage::disk('public')->url($path);
        }

        if ($file = $request->file('file')) {
            $path = $file->store('ebooks/files', 'public');
            $data['file_url'] = Storage::disk('public')->url($path);
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_type'] = $file->getMimeType();
            $data['file_size'] = $file->getSize();
        }

        return $data;
    }

    /** @param array<string, mixed> $data */
    private function setPublishedAt(array &$data, ?Ebook $ebook = null): void
    {
        if ($data['status'] !== EbookStatus::Published->value) {
            return;
        }

        $data['published_at'] ??= $ebook?->published_at ?? now();
    }
}
