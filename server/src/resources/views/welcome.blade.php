<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <title>Welcome</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    <body>
        <div class="container" id="app">
            <h1 class="text-muted">Laravel Broadcast Redis Socket.IO</h1>
            <div id="chat-notification"></div>
        </div>

        <!-- Cargar el script de Socket.IO -->
        <script src="http://{{ request()->getHost() }}:{{ env('LARAVEL_ECHO_PORT') }}/socket.io.js"></script>

        <!-- Cargar el archivo JS de Laravel Echo -->
        <script src="{{ asset('js/app.js') }}"></script>

        <script>
            const userId = '{{ auth()->id() }}';

            // Escuchar el canal de mensajes públicos
            window.Echo.channel('public-message-channel')
                .listen('.MessageEvent', (data) => {
                    // Verificar que el mensaje no sea del usuario actual
                    if (userId !== data.message.user_id) {
                        $('#chat-notification').append('<div class="alert alert-warning">' + data.message + '</div>');
                    }
                });

            // Escuchar el canal de mensajes privados para el usuario
            window.Echo.channel('message-channel.' + userId)
                .listen('MessageEvent', (data) => {
                    // Mostrar el mensaje privado para el usuario
                    $('#chat-notification').append('<div class="alert alert-danger">' + data.message + '</div>');
                });
        </script>
    </body>
</html>
