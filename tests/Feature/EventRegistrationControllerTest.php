<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class EventRegistrationControllerTest extends TestCase
{
    /**
     * Testa o endpoint GET /api/v1/event-registrations para listar inscrições.
     */
    public function testIndexEventRegistrations()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/v1/event-registrations');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'event_id',
                             'user_id',
                             'created_at',
                             'updated_at'
                         ]
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint POST /api/v1/event-registrations para criar uma nova inscrição.
     */
    public function testStoreEventRegistration()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');

        $data = [
            'event_id' => 2,
        ];

        $response = $this->postJson('/api/v1/event-registrations', $data);
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'event_id',
                         'user_id',
                         'created_at',
                         'updated_at'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint GET /api/v1/event-registrations/{id} para exibir uma inscrição.
     */
    public function testShowEventRegistration()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');

        // Cria uma inscrição para teste
        $storeData = ['event_id' => 2];
        $storeResponse = $this->postJson('/api/v1/event-registrations', $storeData);
        $storeResponse->assertStatus(201);
        $registrationId = $storeResponse->json('data.id');

        $response = $this->getJson("/api/v1/event-registrations/{$registrationId}");
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'event_id',
                         'user_id',
                         'created_at',
                         'updated_at'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint PUT /api/v1/event-registrations/{id} para atualizar uma inscrição.
     */
    public function testUpdateEventRegistration()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');

        $storeData = ['event_id' => 2];
        $storeResponse = $this->postJson('/api/v1/event-registrations', $storeData);
        $storeResponse->assertStatus(201);
        $registrationId = $storeResponse->json('data.id');

        $updateData = ['event_id' => 2];
        $response = $this->putJson("/api/v1/event-registrations/{$registrationId}", $updateData);
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'event_id' => 2,
                 ]);
    }

    /**
     * Testa o endpoint DELETE /api/v1/event-registrations/{id} para deletar uma inscrição.
     */
    public function testDestroyEventRegistration()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');

        $storeData = ['event_id' => 2];
        $storeResponse = $this->postJson('/api/v1/event-registrations', $storeData);
        $storeResponse->assertStatus(201);
        $registrationId = $storeResponse->json('data.id');

        $response = $this->deleteJson("/api/v1/event-registrations/{$registrationId}");
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'message' => 'Event registration deleted successfully'
                 ]);
    }
}
