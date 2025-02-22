@extends('emails.layouts.app')

@section('title', 'Confirmação de Inscrição no Evento')

@section('content')
<div style="text-align: center;">
    <h1>Olá, {{ $user->name }}!</h1>
    <p>Você se inscreveu com sucesso no evento: <strong>{{ $registration->event->title ?? 'Título do Evento' }}</strong>.</p>
    <p>Confira os detalhes do evento:</p>
    <ul style="list-style: none; padding: 0;">
        <li>
            <strong>Data:</strong>
            {{ $registration->event->start_time
                ? \Carbon\Carbon::parse($registration->event->start_time)->format('d/m/Y H:i')
                : 'Data não informada' }}
        </li>
        <li><strong>Local:</strong> {{ $registration->event->location ?? 'Local não informado' }}</li>
    </ul>
    <p>Agradecemos sua inscrição!</p>
</div>
@endsection
