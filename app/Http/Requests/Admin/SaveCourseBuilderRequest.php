<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SaveCourseBuilderRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'materials' => ['required', 'array'],
            'materials.*.id' => ['nullable', 'integer'],
            'materials.*.title' => ['required', 'string', 'max:255'],
            'materials.*.description' => ['nullable', 'string'],
            'materials.*.position' => ['required', 'integer', 'min:0'],
            'materials.*.is_published' => ['required', 'boolean'],
            'materials.*.contents' => ['required', 'array'],
            'materials.*.contents.*.id' => ['nullable', 'integer'],
            'materials.*.contents.*.type' => ['required', 'in:video,textbook'],
            'materials.*.contents.*.title' => ['required', 'string', 'max:255'],
            'materials.*.contents.*.description' => ['nullable', 'string'],
            'materials.*.contents.*.position' => ['required', 'integer', 'min:0'],
            'materials.*.contents.*.is_published' => ['required', 'boolean'],
            'materials.*.contents.*.youtube_url' => ['nullable', 'url', 'max:500'],
            'materials.*.contents.*.textbook_content' => ['nullable', 'string'],
            'materials.*.contents.*.attachment_url' => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'materials.required' => 'Minimal satu material harus tersedia.',
            'materials.array' => 'Data material tidak valid.',
            'materials.*.title.required' => 'Judul material wajib diisi.',
            'materials.*.position.required' => 'Posisi material wajib diisi.',
            'materials.*.position.integer' => 'Posisi material harus berupa angka bulat.',
            'materials.*.is_published.required' => 'Status publikasi material wajib dipilih.',
            'materials.*.is_published.boolean' => 'Status publikasi material tidak valid.',
            'materials.*.contents.required' => 'Daftar learning content wajib tersedia.',
            'materials.*.contents.array' => 'Data learning content tidak valid.',
            'materials.*.contents.*.type.required' => 'Tipe learning content wajib dipilih.',
            'materials.*.contents.*.type.in' => 'Tipe learning content harus video atau textbook.',
            'materials.*.contents.*.title.required' => 'Judul learning content wajib diisi.',
            'materials.*.contents.*.position.required' => 'Posisi learning content wajib diisi.',
            'materials.*.contents.*.youtube_url.url' => 'URL YouTube tidak valid.',
            'materials.*.contents.*.textbook_content.string' => 'Isi textbook tidak valid.',
            'materials.*.contents.*.attachment_url.url' => 'URL attachment tidak valid.',
        ];
    }
}
