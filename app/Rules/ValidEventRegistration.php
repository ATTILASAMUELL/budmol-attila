<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Event;

class ValidEventRegistration implements Rule
{
    public function passes($attribute, $value)
    {
        $event = Event::find($value);
        if (!$event) {
            return false;
        }
        if ($event->registrations()->count() >= $event->max_capacity) {
            return false;
        }
        if ($event->status !== 'open') {
            return false;
        }
        return true;
    }

    public function message()
    {
        return 'O evento selecionado não permite inscrições.';
    }
}
