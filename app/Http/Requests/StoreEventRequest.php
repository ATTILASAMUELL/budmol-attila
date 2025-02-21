<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\EventStatus;
use Illuminate\Validation\Rules\Enum as EnumRule;

class StoreEventRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'start_time'   => 'required|date_format:Y-m-d H:i:s',
            'end_time'     => 'required|date_format:Y-m-d H:i:s|after:start_time',
            'location'    => 'required|string',
            'max_capacity'=> 'required|integer|min:1',
            'status'      => ['sometimes', 'required', new EnumRule(EventStatus::class)],
        ];
    }
}
