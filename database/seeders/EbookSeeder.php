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
            ['name' => 'Peternakan', 'slug' => 'peternakan', 'description' => 'Buku panduan peternakan dan pengelolaan ternak.', 'is_active' => true, 'position' => 1],
            ['name' => 'Perikanan', 'slug' => 'perikanan', 'description' => 'Buku budidaya ikan dan pengelolaan perairan.', 'is_active' => true, 'position' => 2],
            ['name' => 'Pertanian & Perkebunan', 'slug' => 'pertanian-perkebunan', 'description' => 'Buku pertanian, perkebunan, dan budidaya tanaman.', 'is_active' => true, 'position' => 3],
            ['name' => 'Bahasa', 'slug' => 'bahasa', 'description' => 'Buku bahasa untuk komunikasi sehari-hari.', 'is_active' => true, 'position' => 4],
            ['name' => 'Agribisnis', 'slug' => 'agribisnis', 'description' => 'Buku pengolahan hasil dan pengembangan usaha.', 'is_active' => true, 'position' => 5],
            ['name' => 'Teknologi', 'slug' => 'teknologi', 'description' => 'Buku teknologi praktis untuk pelaku usaha.', 'is_active' => true, 'position' => 6],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => EbookCategory::query()->updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        foreach ($this->ebooks() as $ebook) {
            $model = Ebook::query()->firstOrNew(['slug' => $ebook['slug']]);
            $model->forceFill([
                ...Arr::except($ebook, ['category']),
                'ebook_category_id' => $categories[$ebook['category']]->id,
                'created_by' => $admin->id,
                'published_at' => now()->subDays(7),
            ])->save();
        }
    }

    private function ebooks(): array
    {
        return [
            $this->ebook('peternakan', 'Panduan Teknologi Peternakan Dasar', 'panduan-teknologi-peternakan-dasar', 'Siti Rahma', 'Panduan kandang, pakan, kesehatan, dan pencatatan ternak.', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80', 132, 2621440),
            $this->ebook('perikanan', 'Panduan Budidaya Ikan Air Tawar', 'panduan-budidaya-ikan-air-tawar', 'Dimas Saputra', 'Panduan praktis menyiapkan kolam, memilih benih, dan merawat ikan.', 'https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=800&q=80', 118, 2359296),
            $this->ebook('pertanian-perkebunan', 'Dasar Perkebunan Berkelanjutan', 'dasar-perkebunan-berkelanjutan', 'Maya Lestari', 'Panduan perencanaan kebun, perawatan tanaman, dan pengelolaan tanah.', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80', 124, 2490368),
            $this->ebook('pertanian-perkebunan', 'Hidroponik di Rumah', 'hidroponik-di-rumah', 'Maya Lestari', 'Panduan membuat instalasi dan merawat sayuran hidroponik untuk pemula.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 96, 1966080),
            $this->ebook('bahasa', 'Bahasa Jepang untuk Pemula', 'bahasa-jepang-untuk-pemula', 'Ayu Wulandari', 'Rangkuman salam, perkenalan, angka, dan percakapan praktis bahasa Jepang.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', 108, 2162688),
            $this->ebook('bahasa', 'Bahasa Inggris Praktis Sehari-hari', 'bahasa-inggris-praktis-sehari-hari', 'Fajar Prasetyo', 'Panduan percakapan bahasa Inggris untuk kebutuhan umum.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 104, 2097152),
            $this->ebook('agribisnis', 'Pengolahan Hasil Pertanian', 'pengolahan-hasil-pertanian', 'Rina Kurnia', 'Panduan meningkatkan nilai jual hasil panen melalui pengolahan dan kemasan.', 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80', 114, 2293760),
            $this->ebook('agribisnis', 'Memulai Usaha Agribisnis', 'memulai-usaha-agribisnis', 'Rina Kurnia', 'Panduan menyusun produk, harga, promosi, dan layanan pelanggan.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80', 120, 2424832),
            $this->ebook('teknologi', 'Literasi Digital untuk UMKM', 'literasi-digital-untuk-umkm', 'Rina Kurnia', 'Panduan katalog digital, pencatatan pesanan, dan keamanan akun usaha.', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80', 92, 1835008),
        ];
    }

    private function ebook(string $category, string $title, string $slug, string $author, string $description, string $coverUrl, int $pages, int $size): array
    {
        return [
            'category' => $category,
            'title' => $title,
            'slug' => $slug,
            'author' => $author,
            'short_description' => $description,
            'description' => $description,
            'cover_url' => $coverUrl,
            'file_url' => 'https://example.test/ebooks/'.$slug.'.pdf',
            'file_name' => $slug.'.pdf',
            'file_type' => 'application/pdf',
            'file_size' => $size,
            'total_pages' => $pages,
            'status' => EbookStatus::Published->value,
        ];
    }
}
