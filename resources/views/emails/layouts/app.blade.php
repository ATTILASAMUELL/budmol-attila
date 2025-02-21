<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Verificação de E-mail')</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
                    <tr>
                        <td align="center">
                            <img src="{{ asset('logo.png') }}" alt="Logo" style="max-width: 200px;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            @yield('content')
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center; color: #999;">
                            <small>© 2025 - Sua Aplicação. Todos os direitos reservados.</small>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
