<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EbookCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/ebook-categories')
            ->assertRedirect(route('login'));
    }

    public function test_students_cannot_access_ebook_categories(): void
    {
        $student = User::factory()->create();

        $this->actingAs($student)
            ->get('/admin/ebook-categories')
            ->assertForbidden();
    }

    public function test_admin_can_view_ebook_categories(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
            'position' => 1,
        ]);

        Ebook::create([
            'ebook_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
        ]);

        $this->actingAs($admin)
            ->get('/admin/ebook-categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/ebook-categories/index')
                ->has('categories', 1)
                ->where('categories.0.name', 'Programming')
                ->where('categories.0.ebooks_count', 1));
    }

    public function test_admin_can_create_ebook_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)
            ->post('/admin/ebook-categories', [
                'name' => 'Programming',
                'slug' => 'programming',
                'description' => 'Programming books.',
                'is_active' => true,
                'position' => 2,
            ])
            ->assertRedirect('/admin/ebook-categories');

        $category = EbookCategory::query()->sole();

        $this->assertSame('Programming', $category->name);
        $this->assertSame('Programming books.', $category->description);
        $this->assertTrue($category->is_active);
    }

    public function test_category_slug_must_be_unique(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        EbookCategory::create(['name' => 'Existing', 'slug' => 'existing']);

        $this->actingAs($admin)
            ->post('/admin/ebook-categories', [
                'name' => 'Duplicate',
                'slug' => 'existing',
                'is_active' => true,
                'position' => 0,
            ])
            ->assertSessionHasErrors('slug');
    }

    public function test_admin_can_update_ebook_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);

        $this->actingAs($admin)
            ->put("/admin/ebook-categories/{$category->id}", [
                'name' => 'Software Engineering',
                'slug' => 'software-engineering',
                'description' => 'Engineering books.',
                'is_active' => false,
                'position' => 3,
            ])
            ->assertRedirect('/admin/ebook-categories');

        $this->assertDatabaseHas('ebook_categories', [
            'id' => $category->id,
            'name' => 'Software Engineering',
            'slug' => 'software-engineering',
            'description' => 'Engineering books.',
            'is_active' => false,
            'position' => 3,
        ]);
    }

    public function test_category_with_ebooks_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Programming',
            'slug' => 'programming',
        ]);
        Ebook::create([
            'ebook_category_id' => $category->id,
            'title' => 'Laravel Basics',
            'slug' => 'laravel-basics',
        ]);

        $this->actingAs($admin)
            ->delete("/admin/ebook-categories/{$category->id}")
            ->assertRedirect('/admin/ebook-categories');

        $this->assertNotSoftDeleted($category);
    }

    public function test_admin_can_soft_delete_unused_ebook_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = EbookCategory::create([
            'name' => 'Unused',
            'slug' => 'unused',
        ]);

        $this->actingAs($admin)
            ->delete("/admin/ebook-categories/{$category->id}")
            ->assertRedirect('/admin/ebook-categories');

        $this->assertSoftDeleted($category);
    }
}
