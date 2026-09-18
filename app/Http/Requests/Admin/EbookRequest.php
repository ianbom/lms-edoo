<?php

namespace App\Http\Requests\Admin;

use App\Enums\EbookStatus;
use App\Models\Ebook;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EbookRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $slugRule = Rule::unique(Ebook::class, 'slug');
        $ebook = $this->route('ebook');

        if ($ebook instanceof Ebook) {
            $slugRule->ignore($ebook);
        }

        $fileIsRequired = $this->input('status') === EbookStatus::Published->value
            && (! $ebook instanceof Ebook || $ebook->file_url === null);

        return [
            'ebook_category_id' => ['required', 'integer', Rule::exists('ebook_categories', 'id')],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', $slugRule],
            'author' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'file' => [Rule::requiredIf($fileIsRequired), 'nullable', 'file', 'mimes:pdf', 'max:20480'],
            'total_pages' => ['nullable', 'integer', 'min:1'],
            'status' => ['required', Rule::enum(EbookStatus::class)],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'ebook_category_id.required' => 'Kategori ebook wajib dipilih.',
            'ebook_category_id.exists' => 'Kategori ebook tidak valid.',
            'title.required' => 'Judul ebook wajib diisi.',
            'slug.required' => 'Slug ebook wajib diisi.',
            'slug.unique' => 'Slug ebook sudah digunakan.',
            'author.max' => 'Nama penulis maksimal 255 karakter.',
            'short_description.max' => 'Deskripsi singkat maksimal 500 karakter.',
            'cover.image' => 'Cover harus berupa gambar.',
            'cover.mimes' => 'Cover hanya boleh berformat JPG, JPEG, PNG, atau WebP.',
            'cover.max' => 'Ukuran cover maksimal 5 MB.',
            'file.required' => 'File PDF wajib diunggah sebelum ebook dipublikasikan.',
            'file.mimes' => 'File ebook harus berformat PDF.',
            'file.max' => 'Ukuran file ebook maksimal 20 MB.',
            'total_pages.integer' => 'Jumlah halaman harus berupa angka bulat.',
            'status.required' => 'Status ebook wajib dipilih.',
            'status.enum' => 'Status ebook tidak valid.',
        ];
    }
}
