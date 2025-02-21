@extends('emails.layouts.app')

@section('title', 'Erro na Verificação de E-mail')

@section('content')
    <div style="text-align: center;">
        <h1 style="color: red;">Ops!</h1>
        <p>Ocorreu um erro ao verificar seu e-mail. O token de verificação é inválido ou expirou.</p>
        <p>
            <a href="{{ url('/') }}" style="background-color: orange; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Voltar para o site</a>
        </p>
    </div>
@endsection
