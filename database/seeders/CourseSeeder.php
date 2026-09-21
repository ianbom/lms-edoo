<?php

namespace Database\Seeders;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseMaterial;
use App\Models\LearningContent;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->where('phone', '088888888')->firstOrFail();

        $categories = collect([
            ['name' => 'Peternakan', 'slug' => 'peternakan', 'description' => 'Kelas pengelolaan ternak dan teknologi peternakan.'],
            ['name' => 'Perikanan', 'slug' => 'perikanan', 'description' => 'Kelas budidaya ikan dan pengelolaan perairan.'],
            ['name' => 'Pertanian & Perkebunan', 'slug' => 'pertanian-perkebunan', 'description' => 'Kelas pertanian, perkebunan, dan budidaya tanaman.'],
            ['name' => 'Bahasa', 'slug' => 'bahasa', 'description' => 'Kelas bahasa untuk komunikasi sehari-hari.'],
            ['name' => 'Agribisnis', 'slug' => 'agribisnis', 'description' => 'Kelas pengolahan hasil dan usaha sektor pertanian.'],
            ['name' => 'Teknologi', 'slug' => 'teknologi', 'description' => 'Kelas teknologi praktis untuk kegiatan usaha.'],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => CourseCategory::query()->updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        $teachers = collect([
            ['name' => 'Siti Rahma', 'expertise' => 'Teknologi Peternakan', 'photo_url' => 'https://i.pravatar.cc/300?img=32'],
            ['name' => 'Dimas Saputra', 'expertise' => 'Budidaya Perikanan', 'photo_url' => 'https://i.pravatar.cc/300?img=11'],
            ['name' => 'Maya Lestari', 'expertise' => 'Agronomi dan Perkebunan', 'photo_url' => 'https://i.pravatar.cc/300?img=47'],
            ['name' => 'Ayu Wulandari', 'expertise' => 'Bahasa Jepang', 'photo_url' => 'https://i.pravatar.cc/300?img=44'],
            ['name' => 'Fajar Prasetyo', 'expertise' => 'Bahasa Inggris', 'photo_url' => 'https://i.pravatar.cc/300?img=12'],
            ['name' => 'Rina Kurnia', 'expertise' => 'Agribisnis dan UMKM', 'photo_url' => 'https://i.pravatar.cc/300?img=49'],
        ])->mapWithKeys(fn (array $teacher) => [
            $teacher['name'] => Teacher::query()->updateOrCreate(['name' => $teacher['name']], $teacher),
        ]);

        foreach ($this->courses() as $definition) {
            $course = Course::query()->firstOrNew(['slug' => $definition['slug']]);
            $course->forceFill([
                ...Arr::except($definition, ['category', 'teachers', 'modules']),
                'course_category_id' => $categories[$definition['category']]->id,
                'created_by' => $admin->id,
                'published_at' => now()->subDays(14),
            ])->save();

            $course->teachers()->sync(
                collect($definition['teachers'])->mapWithKeys(
                    fn (string $teacher, int $position) => [$teachers[$teacher]->id => ['position' => $position]],
                )->all(),
            );

            $this->seedMaterials($course, $definition['modules']);
        }
    }

    private function courses(): array
    {
        return [
            $this->course('peternakan', ['Siti Rahma'], 'Teknologi Peternakan Dasar', 'teknologi-peternakan-dasar', 'Pahami pemeliharaan ternak dengan bantuan teknologi sederhana.', 'Kelas pengantar pengelolaan kandang, pakan, kesehatan ternak, dan pencatatan produksi.', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80', 'Beginner', 300, [['Dasar Pemeliharaan Ternak', 'Mengenal kebutuhan dasar ternak yang sehat.', ['Mengenal jenis dan tujuan usaha ternak', 'Kebutuhan kandang yang bersih dan nyaman', 'Menyusun jadwal perawatan harian']], ['Teknologi dan Pencatatan', 'Gunakan data sederhana untuk meningkatkan hasil.', ['Pakan seimbang untuk ternak', 'Mendeteksi tanda awal penyakit ternak', 'Membuat catatan produksi harian']]]),
            $this->course('perikanan', ['Dimas Saputra'], 'Budidaya Ikan Air Tawar', 'budidaya-ikan-air-tawar', 'Pelajari budidaya lele dan nila dari persiapan kolam hingga panen.', 'Kelas dasar untuk memulai budidaya ikan air tawar secara terukur dan berkelanjutan.', 'https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=1200&q=80', 'Beginner', 330, [['Persiapan Kolam dan Benih', 'Menyiapkan media budidaya yang aman.', ['Memilih jenis ikan air tawar', 'Menyiapkan kolam dan kualitas air', 'Memilih benih ikan yang sehat']], ['Perawatan hingga Panen', 'Merawat ikan agar tumbuh optimal.', ['Mengatur pakan harian ikan', 'Mengendalikan penyakit ikan', 'Menentukan waktu panen']]]),
            $this->course('pertanian-perkebunan', ['Maya Lestari'], 'Dasar Perkebunan Berkelanjutan', 'dasar-perkebunan-berkelanjutan', 'Kelola kebun produktif dengan memperhatikan tanah dan lingkungan.', 'Kelas pengantar untuk perencanaan kebun, perawatan tanaman, dan praktik perkebunan berkelanjutan.', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80', 'Beginner', 300, [['Perencanaan Kebun', 'Membuat kebun yang siap ditanami.', ['Memilih komoditas perkebunan', 'Mengenal kondisi tanah dan iklim', 'Menata lahan dan jarak tanam']], ['Perawatan Tanaman', 'Menjaga tanaman tetap sehat dan produktif.', ['Membuat pupuk organik sederhana', 'Mengelola hama secara ramah lingkungan', 'Mencatat hasil dan biaya kebun']]]),
            $this->course('pertanian-perkebunan', ['Maya Lestari'], 'Hidroponik untuk Pemula', 'hidroponik-untuk-pemula', 'Mulai menanam sayuran hidroponik di rumah dengan langkah praktis.', 'Kelas praktik untuk menyiapkan instalasi sederhana, nutrisi, dan panen sayuran hidroponik.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80', 'Beginner', 240, [['Mengenal Sistem Hidroponik', 'Pilih sistem yang sesuai ruang dan kebutuhan.', ['Dasar menanam tanpa tanah', 'Membuat instalasi hidroponik sederhana', 'Memilih benih sayuran cepat panen']], ['Nutrisi dan Perawatan', 'Merawat tanaman hingga siap dipanen.', ['Meracik dan mengukur nutrisi tanaman', 'Mengatur cahaya dan sirkulasi air', 'Memanen sayuran hidroponik']]]),
            $this->course('bahasa', ['Ayu Wulandari'], 'Bahasa Jepang Sehari-hari', 'bahasa-jepang-sehari-hari', 'Belajar ungkapan Jepang dasar untuk percakapan sehari-hari.', 'Kelas pemula untuk salam, perkenalan, angka, dan percakapan praktis dalam bahasa Jepang.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', 'Beginner', 270, [['Salam dan Perkenalan', 'Bangun dasar percakapan yang sopan.', ['Mengucapkan salam dalam bahasa Jepang', 'Memperkenalkan diri dengan sederhana', 'Menyebut angka dan waktu']], ['Percakapan Praktis', 'Gunakan ungkapan untuk situasi umum.', ['Bertanya arah dan lokasi', 'Berbelanja dengan bahasa Jepang', 'Latihan dialog sehari-hari']]]),
            $this->course('bahasa', ['Fajar Prasetyo'], 'Bahasa Inggris untuk Percakapan', 'bahasa-inggris-untuk-percakapan', 'Tingkatkan percaya diri berbahasa Inggris dalam situasi umum.', 'Kelas percakapan dasar untuk memperkenalkan diri, bertanya, dan merespons percakapan sehari-hari.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'Beginner', 270, [['Membangun Kalimat Dasar', 'Gunakan kalimat sederhana dengan tepat.', ['Memperkenalkan diri dalam bahasa Inggris', 'Menyampaikan rutinitas harian', 'Mengajukan pertanyaan sederhana']], ['Percakapan Sehari-hari', 'Latih respons untuk situasi umum.', ['Memesan makanan dan minuman', 'Berbicara tentang arah perjalanan', 'Latihan dialog singkat']]]),
            $this->course('agribisnis', ['Rina Kurnia'], 'Pengolahan Hasil Pertanian', 'pengolahan-hasil-pertanian', 'Ubah hasil panen menjadi produk bernilai tambah.', 'Kelas dasar untuk memilih bahan baku, menjaga kebersihan produksi, dan membuat kemasan sederhana.', 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80', 'Beginner', 300, [['Mengenal Nilai Tambah Panen', 'Pilih hasil panen yang tepat untuk diolah.', ['Menentukan produk olahan pertanian', 'Memilih bahan baku yang berkualitas', 'Menjaga kebersihan proses produksi']], ['Produk dan Kemasan', 'Siapkan produk agar siap dijual.', ['Teknik pengolahan pangan sederhana', 'Membuat kemasan yang aman', 'Menghitung biaya produksi']]]),
            $this->course('agribisnis', ['Rina Kurnia'], 'Kewirausahaan Produk Agribisnis', 'kewirausahaan-produk-agribisnis', 'Mulai usaha agribisnis dari ide produk sampai pemasaran.', 'Kelas pengantar untuk menyusun produk, menentukan harga, dan memasarkan usaha agribisnis skala kecil.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', 'Beginner', 330, [['Menyusun Ide Usaha', 'Temukan peluang usaha dari lingkungan sekitar.', ['Mengenal peluang produk agribisnis', 'Menentukan target pelanggan', 'Menyusun nilai unik produk']], ['Harga dan Pemasaran', 'Jalankan usaha dengan perencanaan sederhana.', ['Menghitung harga jual produk', 'Membuat promosi sederhana', 'Melayani pelanggan dengan baik']]]),
            $this->course('teknologi', ['Rina Kurnia'], 'Literasi Digital untuk Usaha Kecil', 'literasi-digital-untuk-usaha-kecil', 'Gunakan alat digital sederhana untuk mengelola dan memasarkan usaha.', 'Kelas praktik bagi pelaku usaha kecil untuk memakai komunikasi digital, katalog, dan pencatatan sederhana.', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80', 'Beginner', 240, [['Dasar Kehadiran Digital', 'Siapkan usaha agar mudah ditemukan pelanggan.', ['Membuat profil usaha digital', 'Menyusun katalog produk sederhana', 'Membuat foto produk yang jelas']], ['Pengelolaan Usaha Digital', 'Gunakan alat digital secara aman dan teratur.', ['Membalas pesan pelanggan dengan baik', 'Mencatat pesanan secara digital', 'Menjaga keamanan akun usaha']]]),
        ];
    }

    private function course(string $category, array $teachers, string $title, string $slug, string $shortDescription, string $description, string $image, string $level, int $duration, array $modules): array
    {
        return [
            'category' => $category,
            'teachers' => $teachers,
            'title' => $title,
            'slug' => $slug,
            'short_description' => $shortDescription,
            'description' => $description,
            'thumbnail_url' => $image,
            'banner_url' => $image,
            'level' => $level,
            'estimated_duration_minutes' => $duration,
            'status' => CourseStatus::Published->value,
            'modules' => $modules,
        ];
    }

    private function seedMaterials(Course $course, array $modules): void
    {
        foreach ($modules as $position => $module) {
            $material = CourseMaterial::query()->updateOrCreate(
                ['course_id' => $course->id, 'position' => $position],
                ['title' => $module[0], 'description' => $module[1], 'is_published' => true],
            );

            foreach ($this->contents($module[2]) as $content) {
                LearningContent::query()->updateOrCreate(
                    ['course_material_id' => $material->id, 'position' => $content['position']],
                    $content,
                );
            }
        }
    }

    private function contents(array $topics): array
    {
        return [
            ['type' => 'video', 'title' => $topics[0], 'description' => 'Video pengantar untuk memahami materi.', 'position' => 0, 'youtube_url' => 'https://www.youtube.com/watch?v=ImtZ5yENzgE', 'youtube_video_id' => 'ImtZ5yENzgE', 'video_duration_seconds' => 600, 'textbook_content' => null, 'attachment_url' => null, 'is_published' => true],
            ['type' => 'textbook', 'title' => $topics[1], 'description' => 'Bacaan ringkas untuk memperdalam konsep.', 'position' => 1, 'youtube_url' => null, 'youtube_video_id' => null, 'video_duration_seconds' => null, 'textbook_content' => '<h2>'.$topics[1].'</h2><p>Pelajari langkah penting, catat poin utama, lalu terapkan pada kegiatan sehari-hari.</p>', 'attachment_url' => null, 'is_published' => true],
            ['type' => 'video', 'title' => $topics[2], 'description' => 'Video praktik untuk menerapkan materi.', 'position' => 2, 'youtube_url' => 'https://www.youtube.com/watch?v=G0jO8kUrg-I', 'youtube_video_id' => 'G0jO8kUrg-I', 'video_duration_seconds' => 900, 'textbook_content' => null, 'attachment_url' => null, 'is_published' => true],
        ];
    }
}
