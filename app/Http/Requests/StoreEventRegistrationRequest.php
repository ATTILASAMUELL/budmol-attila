<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidEventRegistration;

class StoreEventRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'  => ['required', 'exists:users,id'],
            'event_id' => ['required', 'exists:events,id', new ValidEventRegistration],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required'  => 'O campo usuário é obrigatório.',
            'user_id.exists'    => 'O usuário selecionado não existe.',
            'event_id.required' => 'O campo evento é obrigatório.',
            'event_id.exists'   => 'O evento selecionado não existe.',
        ];
    }
}
