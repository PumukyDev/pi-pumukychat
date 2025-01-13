<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Send Encrypted Message</title>
</head>
<body>
    <h1>Send a message to {{ $recipient->name }}</h1>

    <form id="messageForm">
        <textarea id="messageInput" placeholder="Write your message here"></textarea>
        <button type="submit">Send Message</button>
    </form>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const recipientPublicKey = `-----BEGIN PUBLIC KEY-----
{{ $recipient->public_key }}
-----END PUBLIC KEY-----`;

            const form = document.getElementById('messageForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const message = document.getElementById('messageInput').value;

                // Convert PEM format public key to CryptoKey
                const publicKey = await window.crypto.subtle.importKey(
                    'spki',
                    Uint8Array.from(atob(recipientPublicKey.replace(/(-----(BEGIN|END) PUBLIC KEY-----|\n)/g, '')), c => c.charCodeAt(0)),
                    { name: 'RSA-OAEP', hash: 'SHA-256' },
                    false,
                    ['encrypt']
                );

                // Encrypt the message
                const encodedMessage = new TextEncoder().encode(message);
                const encryptedMessage = await window.crypto.subtle.encrypt(
                    { name: 'RSA-OAEP' },
                    publicKey,
                    encodedMessage
                );

                // Convert encrypted message to Base64
                const encryptedMessageBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));

                // Send encrypted message to server
                const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
                await fetch("{{ route('message.store', $recipient->id) }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    body: JSON.stringify({
                        message: encryptedMessageBase64,
                    }),
                });

                alert('Message sent successfully!');
                form.reset();
            });
        });
    </script>
</body>
</html>
