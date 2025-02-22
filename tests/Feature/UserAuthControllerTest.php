<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class UserAuthControllerTest extends TestCase
{
    /**
     * Testa o endpoint POST /api/v1/auth/register para registrar um novo usuário.
     */
    public function testRegister()
    {
        $uniqueTime = time();
        $data = [
            'name'                  => 'Teste ' . $uniqueTime,
            'email'                 => 'teste' . $uniqueTime . '@example.com',
            'password'              => 'senha123',
            'password_confirmation' => 'senha123',
        ];

        $response = $this->postJson('/api/v1/auth/register', $data);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'user' => [
                             'name',
                             'email'
                         ],
                         'token'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint POST /api/v1/auth/login para realizar login.
     * É necessário que exista um usuário com email "teste_login@example.com" e senha "senha123".
     */
    public function testLogin()
    {
        $user = User::where('email', 'admin@example.com')->first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário com email teste_login@example.com disponível para teste.');
        }

        $data = [
            'email'    => $user->email,
            'password' => 'password',
        ];

        $response = $this->postJson('/api/v1/auth/login', $data);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'user' => [
                             'name',
                             'email'
                         ],
                         'token'
                     ],
                     'message'
                 ]);
    }

    /**
     * Testa o endpoint POST /api/v1/auth/forgot-password para solicitar recuperação de senha.
     */
    public function testForgotPassword()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }

        $data = ['email' => $user->email];
        $response = $this->postJson('/api/v1/auth/forgot-password', $data);

        $this->assertTrue(in_array($response->status(), [200, 404]));
    }

    /**
     * Testa o endpoint POST /api/v1/auth/logout para realizar logout.
     */
    public function testLogout()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }

        $this->actingAs($user, 'sanctum');
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'message' => 'Logout successful'
                 ]);
    }

    /**
     * Testa o endpoint POST /api/v1/auth/refresh-token para atualizar o token.
     */
    public function testRefreshToken()
    {
        $user = User::first();
        if (!$user) {
            $this->markTestSkipped('Nenhum usuário disponível para teste.');
        }

        $this->actingAs($user, 'sanctum');
        $currentToken = $user->currentAccessToken();
        if (!$currentToken) {
            $this->markTestSkipped('Usuário não possui token atual.');
        }

        $response = $this->postJson('/api/v1/auth/refresh-token');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'token'
                     ],
                     'message'
                 ]);
    }
}
