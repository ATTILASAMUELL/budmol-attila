<?php

namespace App\Services;

use App\Repositories\EventRepository;
use App\Models\Event;
use Illuminate\Database\Eloquent\Collection;

class EventService
{
    protected $eventRepository;

    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    public function getAll(): Collection
    {
        return $this->eventRepository->getAll();
    }

    public function create(array $data): Event
    {
        return $this->eventRepository->create($data);
    }

    public function find(int $id): Event
    {
        return $this->eventRepository->find($id);
    }

    public function update(int $id, array $data): Event
    {
        return $this->eventRepository->update($id, $data);
    }

    public function destroy(int $id): bool
    {
        return $this->eventRepository->destroy($id);
    }
}
