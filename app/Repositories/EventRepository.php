<?php

namespace App\Repositories;

use App\Models\Event;

class EventRepository
{

    public function getAll()
    {
        return Event::all();
    }

    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function find(int $id): Event
    {
        return Event::findOrFail($id);
    }

    public function update(int $id, array $data): Event
    {
        $event = $this->find($id);
        $event->update($data);
        return $event;
    }
}
