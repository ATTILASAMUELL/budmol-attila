<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository
{
    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function markEmailAsVerified(int $id, string $token): ?User
    {
        $user = User::find($id);
        if ($user && $user->verification_token === $token) {
            $user->update([
                'email_verified_at' => now(),
                'verification_token' => null,
            ]);
            return $user;
        }
        return null;
    }

    public function getUsersWithEvents(): Collection
    {
        return User::has('events')->with('events')->get();
    }
}
