<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\EventStatus;
use Illuminate\Validation\Rules\Enum as EnumRule;

class UpdateEventRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|string',
            'start_time'  => 'sometimes|required|date_format:Y-m-d H:i:s',
            'end_time'    => 'sometimes|date_format:Y-m-d H:i:s|after:start_time',
            'location'    => 'sometimes|required|string',
            'max_capacity'=> 'sometimes|required|integer|min:1',
            'status'      => ['sometimes', 'required', new EnumRule(EventStatus::class)],
        ];
    }
}
