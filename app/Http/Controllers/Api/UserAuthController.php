<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\UserAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;
use App\Traits\JsonResponseTrait;
use App\Http\Requests\ForgotPasswordRequest;

class UserAuthController extends Controller
{
    use JsonResponseTrait;

    protected $userAuthService;

    public function __construct(UserAuthService $userAuthService)
    {
        $this->userAuthService = $userAuthService;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->userAuthService->register($data);

            return $this->successResponse(
                [
                    'user'  => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
                'User registered successfully',
                201
            );
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation error', 422, $e->errors());
        } catch (\Exception $e) {
            dd($e->getMessage());
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();
            $result = $this->userAuthService->login($credentials);

            return $this->successResponse(
                [
                    'user'  => new UserResource($result['user']),
                    'token' => $result['token'],
                ],
                'Login successful'
            );
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation error', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user) {
                $this->userAuthService->logout($user);
            }

            return $this->successResponse([], 'Logout successful');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return $this->errorResponse('Not authenticated', 401);
            }

            $currentToken = $user->currentAccessToken();
            if (!$currentToken) {
                return $this->errorResponse('Token not found', 401);
            }

            $newToken = $this->userAuthService->refreshToken($user, $currentToken->id);

            return $this->successResponse(
                ['token' => $newToken],
                'Token refreshed'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->userAuthService->forgotPassword($request->validated()['email']);
            if (!$result) {
                return $this->errorResponse('User not found', 404);
            }
            return $this->successResponse([], 'Temporary password sent to your email.');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

}
