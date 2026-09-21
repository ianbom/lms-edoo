<?php

namespace Database\Seeders;

use App\Enums\EbookStatus;
use App\Models\Ebook;
use App\Models\EbookCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class EbookSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('phone', '088888888')->firstOrFail();

        $categories = collect([
            ['name' => 'Programming', 'slug' => 'programming', 'description' => 'Buku pengembangan perangkat lunak.', 'is_active' => true, 'position' => 1],
            ['name' => 'Design', 'slug' => 'design', 'description' => 'Buku desain produk dan pengalaman pengguna.', 'is_active' => true, 'position' => 2],
            ['name' => 'Data & Business', 'slug' => 'data-business', 'description' => 'Buku data, analitik, dan bisnis.', 'is_active' => true, 'position' => 3],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => EbookCategory::query()->updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        foreach ($this->ebooks() as $ebook) {
            $model = Ebook::query()->firstOrNew(['slug' => $ebook['slug']]);
            $model->forceFill([
                ...Arr::except($ebook, ['category']),
                'ebook_category_id' => $categories[$ebook['category']]->id,
                'created_by' => $admin->id,
                'published_at' => $ebook['status'] === EbookStatus::Published->value ? now()->subDays(7) : null,
            ])->save();
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function ebooks(): array
    {
        return [
            ['category' => 'programming', 'title' => 'Laravel Practical Guide', 'slug' => 'laravel-practical-guide', 'author' => 'Edoo Team', 'short_description' => 'Panduan praktis membangun aplikasi Laravel.', 'description' => 'Pembahasan workflow Laravel untuk proyek nyata.', 'cover_url' => 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/laravel-practical-guide.pdf', 'file_name' => 'laravel-practical-guide.pdf', 'file_type' => 'application/pdf', 'file_size' => 2457600, 'total_pages' => 128, 'status' => EbookStatus::Published->value],
            ['category' => 'programming', 'title' => 'JavaScript Modern Essentials', 'slug' => 'javascript-modern-essentials', 'author' => 'Edoo Team', 'short_description' => 'Konsep JavaScript modern untuk pengembangan web.', 'description' => 'Panduan ES modules, async workflow, dan struktur aplikasi.', 'cover_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/javascript-modern-essentials.pdf', 'file_name' => 'javascript-modern-essentials.pdf', 'file_type' => 'application/pdf', 'file_size' => 2097152, 'total_pages' => 112, 'status' => EbookStatus::Published->value],
            ['category' => 'design', 'title' => 'Design Thinking Workbook', 'slug' => 'design-thinking-workbook', 'author' => 'Nadia Putri', 'short_description' => 'Workbook untuk memvalidasi masalah dan solusi pengguna.', 'description' => 'Template riset, ideasi, prototyping, dan pengujian usability.', 'cover_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/design-thinking-workbook.pdf', 'file_name' => 'design-thinking-workbook.pdf', 'file_type' => 'application/pdf', 'file_size' => 3145728, 'total_pages' => 96, 'status' => EbookStatus::Published->value],
            ['category' => 'design', 'title' => 'UI Pattern Reference', 'slug' => 'ui-pattern-reference', 'author' => 'Nadia Putri', 'short_description' => 'Referensi pola antarmuka untuk produk digital.', 'description' => 'Koleksi pola navigasi, form, feedback, dan empty state.', 'cover_url' => 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/ui-pattern-reference.pdf', 'file_name' => 'ui-pattern-reference.pdf', 'file_type' => 'application/pdf', 'file_size' => 4194304, 'total_pages' => 156, 'status' => EbookStatus::Draft->value],
            ['category' => 'data-business', 'title' => 'Data Analytics Starter Kit', 'slug' => 'data-analytics-starter-kit', 'author' => 'Rizky Maulana', 'short_description' => 'Dasar analisis data untuk mengambil keputusan.', 'description' => 'Panduan memilih metrik, membaca dashboard, dan menyusun insight.', 'cover_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/data-analytics-starter-kit.pdf', 'file_name' => 'data-analytics-starter-kit.pdf', 'file_type' => 'application/pdf', 'file_size' => 2621440, 'total_pages' => 104, 'status' => EbookStatus::Published->value],
            ['category' => 'data-business', 'title' => 'Business Metrics Handbook', 'slug' => 'business-metrics-handbook', 'author' => 'Edoo Team', 'short_description' => 'Kamus metrik produk dan bisnis digital.', 'description' => 'Rangkuman metrik akuisisi, retensi, dan pertumbuhan bisnis.', 'cover_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', 'file_url' => 'https://example.test/ebooks/business-metrics-handbook.pdf', 'file_name' => 'business-metrics-handbook.pdf', 'file_type' => 'application/pdf', 'file_size' => 1835008, 'total_pages' => 88, 'status' => EbookStatus::Archived->value],
        ];
    }
}
