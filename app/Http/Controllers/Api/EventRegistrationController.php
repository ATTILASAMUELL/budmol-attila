<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\EventRegistrationResource;
use App\Services\EventRegistrationService;
use App\Models\EventRegistration;
use App\Http\Requests\StoreEventRegistrationRequest;
use App\Http\Requests\UpdateEventRegistrationRequest;

/**
 * @group Inscrições de Eventos
 *
 * APIs para gerenciamento das inscrições em eventos.
 *
 * Essas rotas permitem listar, criar, exibir, atualizar e deletar inscrições em eventos.
 */
class EventRegistrationController extends Controller
{
    use JsonResponseTrait;

    /**
     * Serviço responsável pela lógica das inscrições em eventos.
     *
     * @var EventRegistrationService
     */
    protected $eventRegistrationService;

    /**
     * Construtor do controller.
     *
     * @param EventRegistrationService $eventRegistrationService Serviço para operações de inscrições.
     */
    public function __construct(EventRegistrationService $eventRegistrationService)
    {
        $this->eventRegistrationService = $eventRegistrationService;
    }

    /**
     * Lista todas as inscrições de eventos.
     *
     * Retorna uma coleção de inscrições com seus respectivos dados.
     *
     * @return JsonResponse
     *
     * @response {
     *  "data": [
     *      {
     *          "id": 1,
     *          "event_id": 10,
     *          "user_id": 5,
     *          "created_at": "2025-05-10T18:00:00Z",
     *          "updated_at": "2025-05-10T18:00:00Z"
     *      }
     *  ],
     *  "message": "Event registrations retrieved successfully"
     * }
     */
    public function index(): JsonResponse
    {
        try {
            $registrations = $this->eventRegistrationService->getAll();
            return $this->successResponse(
                EventRegistrationResource::collection($registrations),
                'Event registrations retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar inscrições de eventos', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Cria uma nova inscrição em evento.
     *
     * Cria uma inscrição a partir dos dados informados na requisição.
     *
     * @bodyParam event_id integer required ID do evento. Ex: 10
     *
     * @param StoreEventRegistrationRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "event_id": 10,
     *      "user_id": 5,
     *      "created_at": "2025-05-10T18:00:00Z",
     *      "updated_at": "2025-05-10T18:00:00Z"
     *  },
     *  "message": "Event registration created successfully"
     * }
     */
    public function store(StoreEventRegistrationRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            // Obtém o ID do usuário autenticado e associa à inscrição
            $user_id = $request->user()->id;
            $data['user_id'] = $user_id;
            $registration = $this->eventRegistrationService->create($data);
            return $this->successResponse(
                new EventRegistrationResource($registration),
                'Event registration created successfully',
                201
            );
        } catch (\Exception $e) {
            Log::error('Erro ao criar inscrição de evento', [
                'user_id'       => $request->user()->id ?? 'usuário não autenticado',
                'request_data'  => $request->all(),
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Exibe os detalhes de uma inscrição em evento específica.
     *
     * Retorna os dados da inscrição identificada pelo ID.
     *
     * @param int $id ID da inscrição.
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "event_id": 10,
     *      "user_id": 5,
     *      "created_at": "2025-05-10T18:00:00Z",
     *      "updated_at": "2025-05-10T18:00:00Z"
     *  },
     *  "message": "Event registration retrieved successfully"
     * }
     */
    public function show($id): JsonResponse
    {
        try {
            $registration = $this->eventRegistrationService->find($id);
            Gate::authorize('view', $registration);
            return $this->successResponse(
                new EventRegistrationResource($registration),
                'Event registration retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao exibir inscrição de evento', [
                'registration_id' => $id,
                'error_message'   => $e->getMessage(),
                'file'            => $e->getFile(),
                'line'            => $e->getLine(),
                'trace'           => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Atualiza os dados de uma inscrição em evento existente.
     *
     * Atualiza uma inscrição com base nos dados enviados e no ID informado.
     *
     * @bodyParam event_id integer ID do evento (se desejar atualizar). Ex: 12
     *
     * @param UpdateEventRegistrationRequest $request
     * @param int $id ID da inscrição a ser atualizada.
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "event_id": 12,
     *      "user_id": 5,
     *      "created_at": "2025-05-10T18:00:00Z",
     *      "updated_at": "2025-05-11T10:00:00Z"
     *  },
     *  "message": "Event registration updated successfully"
     * }
     */
    public function update(UpdateEventRegistrationRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $registration = $this->eventRegistrationService->find($id);
            Gate::authorize('update', $registration);
            $registration = $this->eventRegistrationService->update($id, $data);
            return $this->successResponse(
                new EventRegistrationResource($registration),
                'Event registration updated successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar inscrição de evento', [
                'registration_id' => $id,
                'request_data'    => $request->all(),
                'error_message'   => $e->getMessage(),
                'file'            => $e->getFile(),
                'line'            => $e->getLine(),
                'trace'           => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Remove uma inscrição em evento.
     *
     * Deleta uma inscrição com base no ID informado.
     *
     * @param int $id ID da inscrição a ser removida.
     * @return JsonResponse
     *
     * @response {
     *  "data": null,
     *  "message": "Event registration deleted successfully"
     * }
     */
    public function destroy($id): JsonResponse
    {
        try {
            $registration = $this->eventRegistrationService->find($id);
            Gate::authorize('delete', $registration);
            $this->eventRegistrationService->delete($id);
            return $this->successResponse(
                null,
                'Event registration deleted successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao deletar inscrição de evento', [
                'registration_id' => $id,
                'error_message'   => $e->getMessage(),
                'file'            => $e->getFile(),
                'line'            => $e->getLine(),
                'trace'           => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
