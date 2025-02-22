<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EventControllerTest extends TestCase
{
    /**
     * Autentica um usuário administrador para os testes que exigem autenticação.
     * Se o usuário "admin@example.com" não existir, ele será criado.
     *
     * @return void
     */
    protected function authenticate()
    {
        $user = User::where('email', 'admin@example.com')->first();
        if (!$user) {
            $user = User::create([
                'name'     => 'Admin User',
                'email'    => 'admin@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        $this->actingAs($user, 'sanctum');
    }

    /**
     * Testa o endpoint GET /api/v1/events para listar todos os eventos.
     *
     * Espera que cada evento retorne os campos: id, title, description,
     * start_time, end_time, location, max_capacity e status.
     *
     * @return void
     */
    public function testIndexEvents()
    {
        $this->authenticate();

        $response = $this->getJson('/api/v1/events');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'title',
                             'description',
                             'start_time',
                             'end_time',
                             'location',
                             'max_capacity',
                             'status'
                         ]
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint POST /api/v1/events para criar um novo evento.
     *
     * São enviados os campos esperados: title, description, start_time, end_time,
     * location, max_capacity e status.
     *
     * @return void
     */
    public function testStoreEvent()
    {
        $this->authenticate();

        $data = [
            'title'        => 'Evento de Teste ' . time(),
            'description'  => 'Descrição do evento de teste',
            'start_time'   => date('Y-m-d H:i:s', strtotime('+1 day')),
            'end_time'     => date('Y-m-d H:i:s', strtotime('+1 day +4 hours')),
            'location'     => 'Local de Teste',
            'max_capacity' => 50,
            'status'       => 'open'
        ];

        $response = $this->postJson('/api/v1/events', $data);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'description',
                         'start_time',
                         'end_time',
                         'location',
                         'max_capacity',
                         'status'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint GET /api/v1/events/{id} para exibir os detalhes de um evento.
     *
     * Cria um evento de teste e, em seguida, consulta seus detalhes.
     *
     * @return void
     */
    public function testShowEvent()
    {
        $this->authenticate();
        // Cria um evento para teste
        $data = [
            'title'        => 'Evento para Visualização ' . time(),
            'description'  => 'Descrição do evento para visualização',
            'start_time'   => date('Y-m-d H:i:s', strtotime('+1 day')),
            'end_time'     => date('Y-m-d H:i:s', strtotime('+1 day +3 hours')),
            'location'     => 'Local de Teste',
            'max_capacity' => 100,
            'status'       => 'open'
        ];
        $storeResponse = $this->postJson('/api/v1/events', $data);
        $storeResponse->assertStatus(201);
        $eventId = $storeResponse->json('data.id');

        $response = $this->getJson("/api/v1/events/{$eventId}");
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'description',
                         'start_time',
                         'end_time',
                         'location',
                         'max_capacity',
                         'status'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint PUT /api/v1/events/{id} para atualizar um evento.
     *
     * Cria um evento e, em seguida, atualiza os campos "title" e "description".
     *
     * @return void
     */
    public function testUpdateEvent()
    {
        $this->authenticate();
        // Cria um evento para teste
        $data = [
            'title'        => 'Evento para Atualização ' . time(),
            'description'  => 'Descrição original',
            'start_time'   => date('Y-m-d H:i:s', strtotime('+1 day')),
            'end_time'     => date('Y-m-d H:i:s', strtotime('+1 day +3 hours')),
            'location'     => 'Local Original',
            'max_capacity' => 100,
            'status'       => 'open'
        ];
        $storeResponse = $this->postJson('/api/v1/events', $data);
        $storeResponse->assertStatus(201);
        $eventId = $storeResponse->json('data.id');

        $updateData = [
            'title'       => 'Evento Atualizado ' . time(),
            'description' => 'Descrição atualizada'
        ];

        $response = $this->putJson("/api/v1/events/{$eventId}", $updateData);
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'title'       => $updateData['title'],
                     'description' => $updateData['description']
                 ]);
    }

    /**
     * Testa o endpoint DELETE /api/v1/events/{id} para deletar um evento.
     *
     * Cria um evento de teste e, em seguida, o deleta.
     *
     * @return void
     */
    public function testDestroyEvent()
    {
        $this->authenticate();
        $data = [
            'title'        => 'Evento para Deleção ' . time(),
            'description'  => 'Evento a ser deletado',
            'start_time'   => date('Y-m-d H:i:s', strtotime('+1 day')),
            'end_time'     => date('Y-m-d H:i:s', strtotime('+1 day +2 hours')),
            'location'     => 'Local de Teste',
            'max_capacity' => 30,
            'status'       => 'open'
        ];
        $storeResponse = $this->postJson('/api/v1/events', $data);
        $storeResponse->assertStatus(201);
        $eventId = $storeResponse->json('data.id');

        $response = $this->deleteJson("/api/v1/events/{$eventId}");
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'message' => 'Event deleted successfully'
                 ]);
    }
}
