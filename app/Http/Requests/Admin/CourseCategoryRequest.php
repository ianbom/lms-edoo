<?php

namespace App\Http\Requests\Admin;

use App\Models\CourseCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CourseCategoryRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) ($this->input('slug') ?: $this->input('name'))),
        ]);
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        $slugRule = Rule::unique(CourseCategory::class, 'slug');
        $category = $this->route('course_category');

        if ($category instanceof CourseCategory) {
            $slugRule->ignore($category);
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', $slugRule],
            'description' => ['nullable', 'string'],
        ];
    }
}
