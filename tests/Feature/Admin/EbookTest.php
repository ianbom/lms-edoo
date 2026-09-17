<?php

namespace Tests\Feature\Admin;

use App\Enums\EbookStatus;
use App\Enums\UserRole;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EbookTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/ebooks')->assertRedirect(route('login'));
    }

    public function test_students_cannot_access_ebooks(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get('/admin/ebooks')
            ->assertForbidden();
    }

    public function test_admin_can_search_and_filter_ebooks(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $programming = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);
        $business = EbookCategory::create([
            'name' => 'Business',
            'slug' => 'business',
        ]);

        Ebook::create([
            'ebook_category_id' => $programming->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'author' => 'Taylor',
            'status' => EbookStatus::Published,
        ]);
        Ebook::create([
            'ebook_category_id' => $business->id,
            'title' => 'Startup Handbook',
            'slug' => 'startup-handbook',
            'author' => 'Ries',
            'status' => EbookStatus::Draft,
        ]);

        $this->actingAs($admin)
            ->get("/admin/ebooks?search=laravel&category={$programming->id}&status=published")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/ebooks/index')
                ->has('ebooks.data', 1)
                ->where('ebooks.data.0.title', 'Laravel Basics')
                ->where('filters.search', 'laravel')
                ->where('filters.category', (string) $programming->id)
                ->where('filters.status', 'published')
                ->has('categories', 2)
                ->has('statuses', 3));
    }

    public function test_admin_can_create_published_ebook_with_uploads(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);

        $this->actingAs($admin)
            ->post('/admin/ebooks', [
                'ebook_category_id' => $category->id,
                'title' => 'Laravel Basics',
                'slug' => 'laravel-basics',
                'author' => 'Taylor Otwell',
                'short_description' => 'A Laravel introduction.',
                'description' => 'Long description.',
                'cover' => UploadedFile::fake()->image('cover.jpg'),
                'file' => UploadedFile::fake()->create('laravel.pdf', 1024, 'application/pdf'),
                'total_pages' => 120,
                'status' => EbookStatus::Published->value,
                'published_at' => null,
            ])
            ->assertRedirect('/admin/ebooks');

        $ebook = Ebook::query()->sole();

        $this->assertSame($admin->id, $ebook->creator?->id);
        $this->assertSame(EbookStatus::Published, $ebook->status);
        $this->assertSame('laravel.pdf', $ebook->file_name);
        $this->assertSame('application/pdf', $ebook->file_type);
        $this->assertNotNull($ebook->file_size);
        $this->assertNotNull($ebook->published_at);
        $this->assertStringContainsString('/storage/ebooks/covers/', (string) $ebook->cover_url);
        $this->assertStringContainsString('/storage/ebooks/files/', (string) $ebook->file_url);
        Storage::disk('public')->assertExists('ebooks/covers/'.basename((string) $ebook->cover_url));
        Storage::disk('public')->assertExists('ebooks/files/'.basename((string) $ebook->file_url));
    }

    public function test_published_ebook_requires_a_pdf(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);

        $this->actingAs($admin)
            ->post('/admin/ebooks', [
                'ebook_category_id' => $category->id,
                'title' => 'Laravel Basics',
                'slug' => 'laravel-basics',
                'status' => EbookStatus::Published->value,
            ])
            ->assertSessionHasErrors('file');
    }

    public function test_admin_can_update_ebook_without_replacing_files(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);
        $ebook = Ebook::create([
            'ebook_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
            'cover_url' => 'https://example.test/cover.jpg',
            'file_url' => 'https://example.test/book.pdf',
            'file_name' => 'book.pdf',
            'file_type' => 'application/pdf',
            'file_size' => 1000,
            'status' => EbookStatus::Draft,
        ]);

        $this->actingAs($admin)
            ->put("/admin/ebooks/{$ebook->id}", [
                'ebook_category_id' => $category->id,
                'title' => 'Advanced Laravel',
                'slug' => 'advanced-laravel',
                'author' => 'Taylor Otwell',
                'short_description' => 'Advanced topics.',
                'description' => 'Long description.',
                'total_pages' => 240,
                'status' => EbookStatus::Published->value,
                'published_at' => null,
            ])
            ->assertRedirect('/admin/ebooks');

        $ebook->refresh();

        $this->assertSame('Advanced Laravel', $ebook->title);
        $this->assertSame('https://example.test/cover.jpg', $ebook->cover_url);
        $this->assertSame('https://example.test/book.pdf', $ebook->file_url);
        $this->assertSame(EbookStatus::Published, $ebook->status);
        $this->assertNotNull($ebook->published_at);
    }

    public function test_admin_can_soft_delete_ebook(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);
        $ebook = Ebook::create([
            'ebook_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
        ]);

        $this->actingAs($admin)
            ->delete("/admin/ebooks/{$ebook->id}")
            ->assertRedirect('/admin/ebooks');

        $this->assertSoftDeleted($ebook);
    }
}
