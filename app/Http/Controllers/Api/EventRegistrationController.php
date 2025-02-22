<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\EventRegistrationResource;
use App\Services\EventRegistrationService;
use App\Models\EventRegistration;
use App\Http\Requests\StoreEventRegistrationRequest;
use App\Http\Requests\UpdateEventRegistrationRequest;

class EventRegistrationController extends Controller
{
    use JsonResponseTrait;

    protected $eventRegistrationService;

    public function __construct(EventRegistrationService $eventRegistrationService)
    {
        $this->eventRegistrationService = $eventRegistrationService;
    }

    public function index(): JsonResponse
    {
        try {
            $registrations = $this->eventRegistrationService->getAll();
            return $this->successResponse(
                EventRegistrationResource::collection($registrations),
                'Event registrations retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function store(StoreEventRegistrationRequest $request): JsonResponse
    {
        try {
            Gate::authorize('create', EventRegistration::class);
            $data = $request->validated();
            $registration = $this->eventRegistrationService->create($data);
            return $this->successResponse(
                new EventRegistrationResource($registration),
                'Event registration created successfully',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }

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
            return $this->errorResponse('An error occurred', 500);
        }
    }

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
            return $this->errorResponse('An error occurred', 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $registration = $this->eventRegistrationService->find($id);
            Gate::authorize('delete', $registration);
            $this->eventRegistrationService->delete($id);
            return $this->successResponse(null, 'Event registration deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
