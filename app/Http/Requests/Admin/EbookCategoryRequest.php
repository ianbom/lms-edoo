<?php

namespace App\Http\Requests\Admin;

use App\Models\EbookCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EbookCategoryRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $slugRule = Rule::unique(EbookCategory::class, 'slug');
        $category = $this->route('ebook_category');

        if ($category instanceof EbookCategory) {
            $slugRule->ignore($category);
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', $slugRule],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'thumbnail' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'is_active' => ['required', 'boolean'],
            'position' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori ebook wajib diisi.',
            'slug.required' => 'Slug kategori ebook wajib diisi.',
            'slug.unique' => 'Slug kategori ebook sudah digunakan.',
            'slug.alpha_dash' => 'Slug hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
            'thumbnail.image' => 'Thumbnail harus berupa gambar.',
            'thumbnail.mimes' => 'Thumbnail hanya boleh berformat JPG, JPEG, PNG, atau WebP.',
            'thumbnail.max' => 'Ukuran thumbnail maksimal 5 MB.',
        ];
    }
}
