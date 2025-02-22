<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\EventResource;
use App\Services\EventService;
use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;

/**
 * @group Eventos
 *
 * APIs para gerenciamento de eventos.
 *
 * Essas rotas permitem listar, criar, exibir, atualizar e deletar eventos.
 */
class EventController extends Controller
{
    use JsonResponseTrait;

    /**
     * Serviço responsável pela lógica dos eventos.
     *
     * @var EventService
     */
    protected $eventService;

    /**
     * Construtor do controller.
     *
     * @param EventService $eventService Serviço para operações de eventos.
     */
    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Lista todos os eventos.
     *
     * Retorna uma coleção de eventos com seus respectivos dados.
     *
     * @return JsonResponse
     *
     * @response {
     *  "data": [
     *      {
     *          "id": 1,
     *          "title": "Evento Exemplo",
     *          "description": "Descrição do evento",
     *          "start_time": "2025-05-10 18:00:00",
     *          "end_time": "2025-05-10 22:00:00",
     *          "location": "Salão de Festas",
     *          "max_capacity": 100,
     *          "status": "open"
     *      }
     *  ],
     *  "message": "Events retrieved successfully"
     * }
     */
    public function index(): JsonResponse
    {
        try {
            $events = $this->eventService->getAll();
            return $this->successResponse(
                EventResource::collection($events),
                'Events retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar eventos', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Cria um novo evento.
     *
     * Cria um evento a partir dos dados informados na requisição.
     *
     * @bodyParam title string required Título do evento. Ex: "Festa de Aniversário"
     * @bodyParam description string required Descrição detalhada do evento. Ex: "Festa com DJ e open bar"
     * @bodyParam start_time string required Data e hora de início no formato "Y-m-d H:i:s". Ex: "2025-05-10 18:00:00"
     * @bodyParam end_time string required Data e hora de término no formato "Y-m-d H:i:s" (deve ser posterior a start_time). Ex: "2025-05-10 22:00:00"
     * @bodyParam location string required Local onde ocorrerá o evento. Ex: "Salão de Festas"
     * @bodyParam max_capacity integer required Capacidade máxima do evento. Ex: 100
     * @bodyParam status string sometimes required Status do evento (open, closed, canceled). Ex: "open"
     *
     * @param StoreEventRequest $request
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "title": "Evento Exemplo",
     *      "description": "Descrição do evento",
     *      "start_time": "2025-05-10 18:00:00",
     *      "end_time": "2025-05-10 22:00:00",
     *      "location": "Salão de Festas",
     *      "max_capacity": 100,
     *      "status": "open"
     *  },
     *  "message": "Event created successfully"
     * }
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        try {
            Gate::authorize('create', Event::class);
            $data = $request->validated();
            $event = $this->eventService->create($data);
            return $this->successResponse(
                new EventResource($event),
                'Event created successfully',
                201
            );
        } catch (\Exception $e) {
            Log::error('Erro ao criar evento', [
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Exibe os detalhes de um evento específico.
     *
     * Retorna os dados do evento identificado pelo ID.
     *
     * @param int $id ID do evento.
     * @return JsonResponse
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "title": "Evento Exemplo",
     *      "description": "Descrição do evento",
     *      "start_time": "2025-05-10 18:00:00",
     *      "end_time": "2025-05-10 22:00:00",
     *      "location": "Salão de Festas",
     *      "max_capacity": 100,
     *      "status": "open"
     *  },
     *  "message": "Event retrieved successfully"
     * }
     */
    public function show($id): JsonResponse
    {
        try {
            $event = $this->eventService->find($id);
            Gate::authorize('view', $event);
            return $this->successResponse(
                new EventResource($event),
                'Event retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao exibir evento', [
                'event_id'      => $id,
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Atualiza os dados de um evento existente.
     *
     * Atualiza um evento com base nos dados enviados e no ID informado.
     *
     * @param UpdateEventRequest $request
     * @param int $id ID do evento a ser atualizado.
     * @return JsonResponse
     *
     * @bodyParam title string Título do evento. Ex: "Festa Atualizada"
     * @bodyParam description string Descrição atualizada do evento.
     * @bodyParam start_time string Data e hora de início no formato "Y-m-d H:i:s".
     * @bodyParam end_time string Data e hora de término no formato "Y-m-d H:i:s" (deve ser posterior a start_time).
     * @bodyParam location string Local do evento.
     * @bodyParam max_capacity integer Capacidade máxima.
     * @bodyParam status string Status do evento.
     *
     * @response {
     *  "data": {
     *      "id": 1,
     *      "title": "Evento Atualizado",
     *      "description": "Descrição atualizada",
     *      "start_time": "2025-05-10 18:00:00",
     *      "end_time": "2025-05-10 22:00:00",
     *      "location": "Salão de Festas",
     *      "max_capacity": 100,
     *      "status": "open"
     *  },
     *  "message": "Event updated successfully"
     * }
     */
    public function update(UpdateEventRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $event = $this->eventService->find($id);
            Gate::authorize('update', $event);
            $event = $this->eventService->update($id, $data);
            return $this->successResponse(
                new EventResource($event),
                'Event updated successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar evento', [
                'event_id'      => $id,
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }

    /**
     * Remove um evento.
     *
     * Deleta um evento com base no ID informado.
     *
     * @param int $id ID do evento a ser removido.
     * @return JsonResponse
     *
     * @response {
     *  "data": null,
     *  "message": "Event deleted successfully"
     * }
     */
    public function destroy($id): JsonResponse
    {
        try {
            $event = $this->eventService->find($id);
            Gate::authorize('delete', $event);
            $this->eventService->destroy($id);
            return $this->successResponse(
                null,
                'Event deleted successfully'
            );
        } catch (\Exception $e) {
            Log::error('Erro ao deletar evento', [
                'event_id'      => $id,
                'error_message' => $e->getMessage(),
                'file'          => $e->getFile(),
                'line'          => $e->getLine(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
