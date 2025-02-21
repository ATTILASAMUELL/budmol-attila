<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\EventStatus;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'max_capacity',
        'status'
    ];

    protected $casts = [
        'status' => EventStatus::class,
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
