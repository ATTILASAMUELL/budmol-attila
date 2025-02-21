@extends('emails.layouts.app')

@section('title', 'Verificação de E-mail')

@section('content')
    <div style="text-align: center;">
        <h1 style="color: green;">Parabéns!</h1>
        <p>Seu e-mail foi verificado com sucesso.</p>
        <p>
            <a href="{{ url('/') }}" style="background-color: orange; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Voltar para o site</a>
        </p>
    </div>
@endsection
