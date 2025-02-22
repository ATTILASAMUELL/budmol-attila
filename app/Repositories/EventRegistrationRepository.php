<?php

namespace App\Repositories;

use App\Models\EventRegistration;
use Illuminate\Database\Eloquent\Collection;

class EventRegistrationRepository
{
    public function getAll(): Collection
    {
        return EventRegistration::all();
    }

    public function create(array $data): EventRegistration
    {
        return EventRegistration::create($data);
    }

    public function find(int $id): EventRegistration
    {
        return EventRegistration::findOrFail($id);
    }

    public function update(int $id, array $data): EventRegistration
    {
        $registration = $this->find($id);
        $registration->update($data);
        return $registration;
    }

    public function delete(int $id): bool
    {
        $registration = $this->find($id);
        return $registration->delete();
    }
}
