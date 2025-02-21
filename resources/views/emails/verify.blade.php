@extends('emails.layouts.app')

@section('title', 'Verificação de E-mail')

@section('content')
    <div style="text-align: center;">
        <h1>Olá, {{ $user->name }}!</h1>
        <p>Obrigado por se registrar. Para concluir o cadastro, clique no botão abaixo para verificar seu e-mail:</p>

        <p>
            <a href="{{ $verificationUrl }}" target="_blank" style="background-color: orange; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">
                Verificar E-mail
            </a>
        </p>
        <p>Se você não se cadastrou em nossa plataforma, por favor, ignore este e-mail.</p>
    </div>
@endsection
