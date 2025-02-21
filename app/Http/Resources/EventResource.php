<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'image' => asset('wallpeper-events.png'),
            'title'        => $this->title,
            'description'  => $this->description,
            'start_time'   => $this->start_time,
            'end_time'     => $this->end_time,
            'location'     => $this->location,
            'max_capacity' => $this->max_capacity,
            'status'       => $this->status->value,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
