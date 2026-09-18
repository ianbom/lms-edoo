<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LearningContentRequest extends FormRequest
{
    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'course_material_id' => ['required', 'integer', 'exists:course_materials,id'],
            'type' => ['required', Rule::in(['video', 'textbook'])],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'position' => ['required', 'integer', 'min:0'],
            'youtube_url' => ['nullable', 'required_if:type,video', 'url', 'max:500'],
            'textbook_content' => ['nullable', 'required_if:type,textbook', 'string'],
            'attachment_url' => ['nullable', 'url', 'max:500'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
