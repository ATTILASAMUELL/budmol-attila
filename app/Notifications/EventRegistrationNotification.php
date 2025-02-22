<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class EventRegistrationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $registration;

    public function __construct($registration)
    {
        $this->registration = $registration;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Confirmação de Inscrição no Evento')
            ->view(
                'emails.event_registration',
                [
                    'user'          => $notifiable,
                    'registration'  => $this->registration,
                ]
            );
    }
}
