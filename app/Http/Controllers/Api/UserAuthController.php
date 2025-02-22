<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Services\UserAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;
use App\Traits\JsonResponseTrait;

/**
 * @group Autenticação de Usuários
 *
 * APIs para registro, login, logout e recuperação de senha de usuários.
 */
class UserAuthController extends Controller
{
    use JsonResponseTrait;

    /**
     * Serviço responsável pela autenticação de usuários.
     *
     * @var UserAuthService
     */
    protected $userAuthService;

    /**
     * Construtor do controller.
     *
     * @param UserAuthService $userAuthService Serviço para operações de autenticação.
     */
    public function __construct(UserAuthService $userAuthService)
    {
        $this->userAuthService = $userAuthService;
    }

    /**
     * Registra um novo usuário.
     *
     * Cria um novo usuário e gera um token de autenticação.
     *
     * @bodyParam name string required Nome do usuário. Ex: "João da Silva"
     * @bodyParam email string required Email do usuário. Ex: "joao@example.com"
     * @bodyParam password string required Senha do usuário. Ex: "senha123"
     * @bodyParam password_confirmation string required Confirmação da senha. Ex: "senha123"
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "user": {
     *          "id": 1,
     *          "name": "João da Silva",
     *          "email": "joao@example.com",
     *          // outros atributos do usuário
     *      },
     *      "token": "token_de_autenticacao_aqui"
     *  },
     *  "message": "User registered successfully"
     * }
     */
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
            Log::warning('Erro de validação no registro de usuário', [
                'errors' => $e->errors(),
            ]);
            return $this->errorResponse('Validation error', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Erro ao registrar usuário', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Realiza o login do usuário.
     *
     * Valida as credenciais e retorna o usuário autenticado com o token.
     *
     * @bodyParam email string required Email do usuário. Ex: "joao@example.com"
     * @bodyParam password string required Senha do usuário. Ex: "senha123"
     *
     * @param LoginRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "user": {
     *          "id": 1,
     *          "name": "João da Silva",
     *          "email": "joao@example.com"
     *      },
     *      "token": "token_de_autenticacao_aqui"
     *  },
     *  "message": "Login successful"
     * }
     */
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
            Log::warning('Erro de validação no login do usuário', [
                'errors' => $e->errors(),
            ]);
            return $this->errorResponse('Validation error', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Erro ao realizar login', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Realiza o logout do usuário autenticado.
     *
     * Revoga o token de acesso do usuário.
     *
     * @param Request $request
     * @return JsonResponse
     *
     * @response {
     *  "data": [],
     *  "message": "Logout successful"
     * }
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user) {
                $this->userAuthService->logout($user);
            }
            return $this->successResponse([], 'Logout successful');
        } catch (\Exception $e) {
            Log::error('Erro ao realizar logout', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Atualiza (refresca) o token de autenticação do usuário.
     *
     * Gera um novo token para o usuário autenticado.
     *
     * @param Request $request
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "token": "novo_token_de_autenticacao"
     *  },
     *  "message": "Token refreshed"
     * }
     */
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
            Log::error('Erro ao atualizar token', [
                'user_id'       => $request->user()->id ?? 'não autenticado',
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Solicita a recuperação de senha.
     *
     * Envia uma senha temporária para o e-mail do usuário, caso o mesmo seja encontrado.
     *
     * @bodyParam email string required Email do usuário. Ex: "joao@example.com"
     *
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "data": [],
     *  "message": "Temporary password sent to your email."
     * }
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->userAuthService->forgotPassword($request->validated()['email']);
            if (!$result) {
                return $this->errorResponse('User not found', 404);
            }
            return $this->successResponse([], 'Temporary password sent to your email.');
        } catch (\Exception $e) {
            Log::error('Erro ao solicitar recuperação de senha', [
                'email'         => $request->validated()['email'] ?? 'não informado',
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
