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
        $admin = User::query()->where('phone', '0000000000')->firstOrFail();

        $categories = collect([
            ['name' => 'Web Development', 'slug' => 'web-development', 'description' => 'Kelas untuk membangun aplikasi web modern.'],
            ['name' => 'UI/UX Design', 'slug' => 'ui-ux-design', 'description' => 'Kelas desain produk digital yang berpusat pada pengguna.'],
            ['name' => 'Data & AI', 'slug' => 'data-ai', 'description' => 'Kelas data, analitik, dan kecerdasan buatan.'],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => CourseCategory::query()->updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        $teachers = collect([
            ['name' => 'Andi Pratama', 'expertise' => 'Full-stack Web Development', 'photo_url' => 'https://i.pravatar.cc/300?img=12'],
            ['name' => 'Nadia Putri', 'expertise' => 'Product and UI/UX Design', 'photo_url' => 'https://i.pravatar.cc/300?img=47'],
            ['name' => 'Rizky Maulana', 'expertise' => 'Data Analytics', 'photo_url' => 'https://i.pravatar.cc/300?img=11'],
            ['name' => 'Salsa Anindita', 'expertise' => 'Laravel Architecture', 'photo_url' => 'https://i.pravatar.cc/300?img=32'],
        ])->mapWithKeys(fn (array $teacher) => [
            $teacher['name'] => Teacher::query()->updateOrCreate(['name' => $teacher['name']], $teacher),
        ]);

        foreach ($this->courses() as $definition) {
            $course = Course::query()->firstOrNew(['slug' => $definition['slug']]);
            $course->forceFill([
                ...Arr::except($definition, ['category', 'teachers']),
                'course_category_id' => $categories[$definition['category']]->id,
                'created_by' => $admin->id,
                'published_at' => $definition['status'] === CourseStatus::Published->value ? now()->subDays(14) : null,
            ])->save();

            $course->teachers()->sync(
                collect($definition['teachers'])->mapWithKeys(
                    fn (string $teacher, int $position) => [$teachers[$teacher]->id => ['position' => $position]],
                )->all(),
            );

            $this->seedMaterials($course);
        }
    }

    /**
     * @return array<int, array{
     *     category: string,
     *     teachers: array<int, string>,
     *     title: string,
     *     slug: string,
     *     short_description: string,
     *     description: string,
     *     thumbnail_url: string,
     *     banner_url: string,
     *     level: string,
     *     estimated_duration_minutes: int,
     *     status: string
     * }>
     */
    private function courses(): array
    {
        return [
            [
                'category' => 'web-development',
                'teachers' => ['Andi Pratama'],
                'title' => 'Fundamental Web Development',
                'slug' => 'fundamental-web-development',
                'short_description' => 'Bangun fondasi HTML, CSS, JavaScript, dan workflow web modern.',
                'description' => 'Kelas dasar untuk memahami fondasi pengembangan website dari struktur halaman hingga interaksi JavaScript.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
                'banner_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
                'level' => 'Beginner',
                'estimated_duration_minutes' => 360,
                'status' => CourseStatus::Published->value,
            ],
            [
                'category' => 'ui-ux-design',
                'teachers' => ['Nadia Putri'],
                'title' => 'UI/UX Design Fundamentals',
                'slug' => 'ui-ux-design-fundamentals',
                'short_description' => 'Rancang produk digital yang jelas, konsisten, dan mudah digunakan.',
                'description' => 'Kelas pengantar untuk riset pengguna, user flow, wireframe, dan dasar visual design.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
                'banner_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80',
                'level' => 'Beginner',
                'estimated_duration_minutes' => 300,
                'status' => CourseStatus::Published->value,
            ],
            [
                'category' => 'data-ai',
                'teachers' => ['Rizky Maulana'],
                'title' => 'Data Analytics for Beginners',
                'slug' => 'data-analytics-for-beginners',
                'short_description' => 'Ubah data mentah menjadi insight yang dapat ditindaklanjuti.',
                'description' => 'Kelas dasar data analytics dari pengenalan data, metrik, hingga penyusunan insight.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                'banner_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
                'level' => 'Beginner',
                'estimated_duration_minutes' => 330,
                'status' => CourseStatus::Published->value,
            ],
            [
                'category' => 'web-development',
                'teachers' => ['Andi Pratama', 'Salsa Anindita'],
                'title' => 'Advanced Laravel Architecture',
                'slug' => 'advanced-laravel-architecture',
                'short_description' => 'Rancang aplikasi Laravel yang modular dan mudah dirawat.',
                'description' => 'Kelas lanjutan mengenai pemisahan concern, service layer, dan arsitektur Laravel.',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
                'banner_url' => 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1600&q=80',
                'level' => 'Advanced',
                'estimated_duration_minutes' => 480,
                'status' => CourseStatus::Draft->value,
            ],
        ];
    }

    private function seedMaterials(Course $course): void
    {
        foreach ([1, 2] as $position) {
            $material = CourseMaterial::query()->updateOrCreate(
                ['course_id' => $course->id, 'position' => $position],
                [
                    'title' => "Modul {$position}: {$course->title}",
                    'description' => "Materi inti {$position} untuk kelas {$course->title}.",
                    'is_published' => true,
                ],
            );

            foreach ($this->contents($course, $position) as $content) {
                LearningContent::query()->updateOrCreate(
                    ['course_material_id' => $material->id, 'position' => $content['position']],
                    $content,
                );
            }
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function contents(Course $course, int $materialPosition): array
    {
        return [
            [
                'type' => 'video',
                'title' => "Pengantar modul {$materialPosition}",
                'description' => "Video pembuka modul {$materialPosition} {$course->title}.",
                'position' => 1,
                'youtube_url' => 'https://www.youtube.com/watch?v=ImtZ5yENzgE',
                'youtube_video_id' => 'ImtZ5yENzgE',
                'video_duration_seconds' => 600,
                'textbook_content' => null,
                'attachment_url' => null,
                'is_published' => true,
            ],
            [
                'type' => 'textbook',
                'title' => "Ringkasan modul {$materialPosition}",
                'description' => "Catatan penting untuk modul {$materialPosition}.",
                'position' => 2,
                'youtube_url' => null,
                'youtube_video_id' => null,
                'video_duration_seconds' => null,
                'textbook_content' => "<h2>Modul {$materialPosition}</h2><p>Pelajari konsep utama {$course->title} dan terapkan pada latihan mandiri.</p>",
                'attachment_url' => null,
                'is_published' => true,
            ],
            [
                'type' => 'video',
                'title' => "Praktik modul {$materialPosition}",
                'description' => "Praktik terarah untuk modul {$materialPosition}.",
                'position' => 3,
                'youtube_url' => 'https://www.youtube.com/watch?v=G0jO8kUrg-I',
                'youtube_video_id' => 'G0jO8kUrg-I',
                'video_duration_seconds' => 900,
                'textbook_content' => null,
                'attachment_url' => null,
                'is_published' => true,
            ],
        ];
    }
}
