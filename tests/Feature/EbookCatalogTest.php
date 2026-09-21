<?php

namespace Tests\Feature;

use App\Enums\EbookStatus;
use App\Models\Ebook;
use App\Models\EbookCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EbookCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_can_view_published_ebooks_from_active_categories(): void
    {
        $activeCategory = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
            'is_active' => true,
        ]);
        $inactiveCategory = EbookCategory::create([
            'name' => 'Archived',
            'slug' => 'archived',
            'is_active' => false,
        ]);
        $published = Ebook::create([
            'ebook_category_id' => $activeCategory->id,
            'title' => 'Laravel Fundamentals',
            'slug' => 'laravel-fundamentals',
            'file_url' => 'https://example.test/ebooks/laravel.pdf',
            'status' => EbookStatus::Published,
            'published_at' => now(),
        ]);
        Ebook::create([
            'ebook_category_id' => $activeCategory->id,
            'title' => 'Draft Ebook',
            'slug' => 'draft-ebook',
            'file_url' => 'https://example.test/ebooks/draft.pdf',
            'status' => EbookStatus::Draft,
        ]);
        Ebook::create([
            'ebook_category_id' => $inactiveCategory->id,
            'title' => 'Inactive Ebook',
            'slug' => 'inactive-ebook',
            'file_url' => 'https://example.test/ebooks/inactive.pdf',
            'status' => EbookStatus::Published,
            'published_at' => now(),
        ]);

        $this->get('/ebooks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home/ebooks/index')
                ->has('ebooks', 1)
                ->where('ebooks.0.id', $published->id)
                ->where('ebooks.0.category', 'Programming')
                ->missing('ebooks.1'));
    }
}
