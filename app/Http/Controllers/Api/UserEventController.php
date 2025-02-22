<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Traits\JsonResponseTrait;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class UserEventController extends Controller
{
    use JsonResponseTrait;

    public function index(): JsonResponse
    {
        try {
            $users = User::has('events')->with('events')->get();
            return $this->successResponse(
                UserResource::collection($users),
                'Users with events retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred', 500);
        }
    }
}
