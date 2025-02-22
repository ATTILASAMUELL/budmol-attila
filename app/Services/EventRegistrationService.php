<?php

namespace App\Services;

use App\Repositories\EventRegistrationRepository;
use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Collection;

class EventRegistrationService
{
    protected $eventRegistrationRepository;

    public function __construct(EventRegistrationRepository $eventRegistrationRepository)
    {
        $this->eventRegistrationRepository = $eventRegistrationRepository;
    }

    public function getAll(): Collection
    {
        return $this->eventRegistrationRepository->getAll();
    }

    public function create(array $data): EventRegistration
    {
        return $this->eventRegistrationRepository->create($data);
    }

    public function find(int $id): EventRegistration
    {
        return $this->eventRegistrationRepository->find($id);
    }

    public function update(int $id, array $data): EventRegistration
    {
        return $this->eventRegistrationRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->eventRegistrationRepository->delete($id);
    }
}
