<?php

namespace App\Http\Requests\Admin;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    use PasswordValidationRules, ProfileValidationRules;

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama student wajib diisi.',
            'phone.required' => 'Phone student wajib diisi.',
            'phone.unique' => 'Phone student sudah digunakan.',
            'email.email' => 'Format email student tidak valid.',
            'email.unique' => 'Email student sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ];
    }
}
