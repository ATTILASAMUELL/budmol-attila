<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class UserEventControllerTest extends TestCase
{
    /**
     * Autentica um usuário para os testes protegidos.
     *
     * Se não houver um usuário (por exemplo, um administrador) disponível, o teste será ignorado.
     *
     * @return void
     */
    protected function authenticate()
    {
        $user = User::where('email', 'admin@example.com')->first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }
        $this->actingAs($user, 'sanctum');
    }

    /**
     * Testa o endpoint GET /api/v1/users-with-events para listar usuários.
     *
     * Como o UserResource não retorna o campo "id" nem o relacionamento "events",
     * a estrutura esperada é apenas "name" e "email".
     *
     * @return void
     */
    public function testIndexUserEvents()
    {
        $this->authenticate();

        $response = $this->getJson('/api/v1/users-with-events');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'name',
                             'email'
                         ]
                     ],
                     'message'
                 ]);
    }
}
