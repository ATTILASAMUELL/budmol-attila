<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Event;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    public function create(User $user)
    {
        return $user->hasPermissionTo('create events', 'api');
    }

    public function view(User $user, Event $event)
    {
        return $user->hasPermissionTo('view events', 'api');
    }

    public function update(User $user, Event $event)
    {
        return $user->hasPermissionTo('edit events', 'api');
    }

    public function delete(User $user, Event $event)
    {
        return $user->hasPermissionTo('delete events', 'api');
    }

    public function viewRegistrations(User $user, Event $event)
    {
        return $user->hasPermissionTo('view registrations', 'api');
    }

    public function register(User $user, Event $event)
    {
        return $user->hasPermissionTo('register events', 'api');
    }
}
