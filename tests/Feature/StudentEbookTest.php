<?php

namespace Tests\Feature;

use App\Enums\EbookStatus;
use App\Enums\UserRole;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentEbookTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/student/ebooks')->assertRedirect(route('login'));
    }

    public function test_only_students_can_view_available_ebooks(): void
    {
        $student = User::factory()->create();
        $admin = User::factory()->create(['role' => UserRole::Admin]);
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

        Ebook::create([
            'ebook_category_id' => $activeCategory->id,
            'title' => 'Laravel Practical Guide',
            'slug' => 'laravel-practical-guide',
            'author' => 'Edoo Team',
            'file_url' => 'https://example.test/ebooks/laravel.pdf',
            'total_pages' => 128,
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
            'title' => 'Inactive Category Ebook',
            'slug' => 'inactive-category-ebook',
            'file_url' => 'https://example.test/ebooks/inactive.pdf',
            'status' => EbookStatus::Published,
        ]);
        Ebook::create([
            'ebook_category_id' => $activeCategory->id,
            'title' => 'No File Ebook',
            'slug' => 'no-file-ebook',
            'status' => EbookStatus::Published,
        ]);

        $this->actingAs($student)
            ->get('/student/ebooks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('student/class/ebooks')
                ->has('ebooks', 1)
                ->where('ebooks.0.title', 'Laravel Practical Guide')
                ->where('ebooks.0.file_url', 'https://example.test/ebooks/laravel.pdf')
                ->where('ebooks.0.category', 'Programming'));

        $this->actingAs($admin)
            ->get('/student/ebooks')
            ->assertForbidden();
    }
}
