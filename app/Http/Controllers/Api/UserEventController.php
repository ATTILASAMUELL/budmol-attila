<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserEventService;

/**
 * @group Eventos dos Usuários
 *
 * APIs para gerenciamento dos usuários e seus eventos associados.
 *
 * Essa rota permite listar os usuários que possuem eventos vinculados.
 *
 * @responseField data array Lista de usuários.
 * @responseField data.*.name string Nome do usuário.
 * @responseField data.*.email string Email do usuário.
 * @responseField message string Mensagem de sucesso.
 */
class UserEventController extends Controller
{
    use JsonResponseTrait;

    /**
     * Serviço responsável por operações relacionadas aos eventos dos usuários.
     *
     * @var UserEventService
     */
    protected $userEventService;

    /**
     * Construtor do controller.
     *
     * @param UserEventService $userEventService Serviço para obter os usuários com eventos.
     */
    public function __construct(UserEventService $userEventService)
    {
        $this->userEventService = $userEventService;
    }

    /**
     * Lista todos os usuários com eventos associados.
     *
     * Retorna uma coleção de usuários que possuem eventos vinculados, utilizando o recurso UserResource.
     *
     * @return JsonResponse
     *
     * @response {
     *  "data": [
     *      {
     *          "name": "João da Silva",
     *          "email": "joao@example.com"
     *      }
     *  ],
     *  "message": "Users with events retrieved successfully"
     * }
     */
    public function index(): JsonResponse
    {
        try {
            $users = $this->userEventService->getUsersWithEvents();
            return $this->successResponse(
                UserResource::collection($users),
                'Users with events retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
