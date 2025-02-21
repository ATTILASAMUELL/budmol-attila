<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\EventResource;
use App\Services\EventService;
use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;

class EventController extends Controller
{
    use JsonResponseTrait;

    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(): JsonResponse
    {
        try {
            $events = $this->eventService->getAll();
            return $this->successResponse(
                EventResource::collection($events),
                'Events retrieved successfully'
            );
        } catch (\Exception $e) {
            dd($e->getMessage());
            return $this->errorResponse('An error occurred', 500);
        }
    }

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
            dd($e->getMessage());
            return $this->errorResponse('An error occurred', 500);
        }
    }

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
            return $this->errorResponse('An error occurred', 500);
        }
    }

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
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
