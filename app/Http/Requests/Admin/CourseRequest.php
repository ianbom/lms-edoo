<?php

namespace App\Http\Requests\Admin;

use App\Enums\CourseStatus;
use App\Models\Course;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $slug = Rule::unique(Course::class, 'slug');
        $course = $this->route('course');

        if ($course instanceof Course) {
            $slug->ignore($course);
        }

        return [
            'course_category_id' => ['required', 'integer', Rule::exists('course_categories', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', $slug],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'level' => ['nullable', 'string', 'max:100'],
            'estimated_duration_minutes' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(CourseStatus::class)],
            'teacher_ids' => ['array'],
            'teacher_ids.*' => ['integer', 'distinct', Rule::exists('teachers', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'course_category_id.required' => 'Kategori course wajib dipilih.',
            'course_category_id.exists' => 'Kategori course tidak valid.',
            'title.required' => 'Judul course wajib diisi.',
            'slug.required' => 'Slug course wajib diisi.',
            'slug.unique' => 'Slug course sudah digunakan.',
            'slug.alpha_dash' => 'Slug hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
            'short_description.max' => 'Deskripsi singkat maksimal 500 karakter.',
            'thumbnail.image' => 'Thumbnail harus berupa gambar.',
            'thumbnail.mimes' => 'Thumbnail hanya boleh berformat JPG, JPEG, PNG, atau WebP.',
            'thumbnail.max' => 'Ukuran thumbnail maksimal 5 MB.',
            'banner.image' => 'Banner harus berupa gambar.',
            'banner.mimes' => 'Banner hanya boleh berformat JPG, JPEG, PNG, atau WebP.',
            'banner.max' => 'Ukuran banner maksimal 5 MB.',
            'estimated_duration_minutes.integer' => 'Durasi harus berupa angka bulat.',
            'status.required' => 'Status course wajib dipilih.',
            'status.enum' => 'Status course tidak valid.',
            'teacher_ids.array' => 'Daftar teacher tidak valid.',
            'teacher_ids.*.exists' => 'Teacher yang dipilih tidak valid.',
            'teacher_ids.*.distinct' => 'Teacher tidak boleh dipilih lebih dari sekali.',
        ];
    }
}
