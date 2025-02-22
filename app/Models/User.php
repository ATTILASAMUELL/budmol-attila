<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use App\Notifications\VerifyEmailNotification;
use App\Notifications\ForgotPasswordNotification;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Event;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'verification_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function generateVerificationToken(): void
    {
        $this->verification_token = Str::random(40);
        $this->save();
    }

    public function sendEmailVerificationNotification(): void
    {
        $this->generateVerificationToken();
        $verificationUrl = url("/email/verify/{$this->id}?token={$this->verification_token}");
        $this->notify(new VerifyEmailNotification($verificationUrl));
    }

    public function sendForgotPasswordNotification($temporaryPassword): void
    {
        $this->notify(new ForgotPasswordNotification($temporaryPassword));
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_registrations', 'user_id', 'event_id');
    }
}
