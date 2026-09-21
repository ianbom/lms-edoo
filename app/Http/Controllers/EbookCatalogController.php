<?php

namespace App\Http\Controllers;

use App\Enums\EbookStatus;
use App\Models\Ebook;
use Inertia\Inertia;
use Inertia\Response;

class EbookCatalogController extends Controller
{
    public function __invoke(): Response
    {
        $ebooks = Ebook::query()
            ->select([
                'id',
                'ebook_category_id',
                'title',
                'slug',
                'author',
                'short_description',
                'cover_url',
                'file_url',
                'total_pages',
                'published_at',
            ])
            ->with('category:id,name')
            ->where('status', EbookStatus::Published)
            ->whereNotNull('file_url')
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->latest('published_at')
            ->get()
            ->map(fn (Ebook $ebook) => [
                'id' => $ebook->id,
                'title' => $ebook->title,
                'slug' => $ebook->slug,
                'author' => $ebook->author,
                'short_description' => $ebook->short_description,
                'cover_url' => $ebook->cover_url,
                'file_url' => $ebook->file_url,
                'total_pages' => $ebook->total_pages,
                'category' => $ebook->category?->name,
            ]);

        return Inertia::render('home/ebooks/index', ['ebooks' => $ebooks]);
    }
}
