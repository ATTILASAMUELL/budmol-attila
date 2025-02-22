@extends('emails.layouts.app')

@section('title', 'Recuperação de Senha')

@section('content')
<div style="text-align: center;">
    <h1>Olá, {{ $user->name }}!</h1>
    <p>Você solicitou a recuperação de senha. Sua senha provisória é:</p>
    <p style="font-size: 24px; font-weight: bold;">{{ $temporaryPassword }}</p>
    <p>Utilize essa senha para realizar o login e, em seguida, altere-a imediatamente.</p>
    <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail.</p>
</div>
@endsection
