<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventRegistrationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'event' => $this->whenLoaded('event', function () {
                return [
                    'id' => $this->event->id,
                    'title' => $this->event->title,
                    'description' => $this->event->description,
                    'start_time' => $this->event->start_time,
                    'end_time' => $this->event->end_time,
                    'location' => $this->event->location,
                    'max_capacity' => $this->event->max_capacity,
                    'status' => $this->event->status,
                ];
            }),
        ];
    }
}
