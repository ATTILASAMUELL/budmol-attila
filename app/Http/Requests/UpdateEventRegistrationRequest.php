<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidEventRegistration;

class UpdateEventRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['sometimes', 'exists:events,id', new ValidEventRegistration],
        ];
    }

    public function messages(): array
    {
        return [
            'event_id.exists' => 'O evento selecionado não existe.',
        ];
    }
}
