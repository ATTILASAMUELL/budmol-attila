<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Str;


class UserAuthService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->createUser($data);
        $user->assignRole('participant');

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth_token')->plainTextToken;
        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email'] ?? '');
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return [
            'user' => $user,
            'token' => $token
        ];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    public function refreshToken(User $user, string $currentTokenId): string
    {
        $user->tokens()->where('id', $currentTokenId)->delete();
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function verifyEmail(int $id, string $token): bool
    {
        $user = $this->userRepository->markEmailAsVerified($id, $token);
        return $user !== null;
    }

    public function forgotPassword(string $email): bool
    {
        $user = $this->userRepository->findByEmail($email);
        if (!$user) {
            return false;
        }
        $temporaryPassword = Str::random(8);
        $user->password = Hash::make($temporaryPassword);
        $user->save();
        $user->sendForgotPasswordNotification($temporaryPassword);
        return true;
    }
}
