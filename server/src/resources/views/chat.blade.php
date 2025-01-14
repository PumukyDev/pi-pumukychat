@extends('layouts.app')

@section('title', 'PumukyDev - Chat')

@section('content')
    <h1>Encrypted Chat</h1>

    @if (Route::has('login'))
        <nav>
            @auth
                <div class="center">
                    <p>The chat is not working at the moment, please be patient</p>
                </div>
                <h2>User list:</h2>
                <ul>
                    @foreach ($users as $user)
                        <li>
                            <a href="{{ route('message.form', ['id' => $user->id]) }}">
                                {{ $user->id }}
                            </a>
                        </li>
                    @endforeach
                </ul>
                <h2>Messages list:</h2>
                <ul id="messagesList">
                    @foreach ($messages as $message)
                        <li class="encrypted-message" data-encrypted="{{ $message->message }}">
                            <!-- Aquí aparecerá el texto descifrado -->
                        </li>
                    @endforeach
                </ul>

                <!-- Script to decrypt the message -->
                <script>
                    document.addEventListener("DOMContentLoaded", async () => {
                        const encryptedMessages = document.querySelectorAll(".encrypted-message");

                        for (const messageElement of encryptedMessages) {
                            const encryptedMessage = messageElement.dataset.encrypted;

                            try {
                                const decryptedMessage = await decryptMessageFromPrivateKey(encryptedMessage);
                                messageElement.innerText = decryptedMessage; // Shot the decrypted message
                            } catch (error) {
                                messageElement.innerText = "Error decrypting message.";
                                console.error("Error decrypting message:", error);
                            }
                        }
                    });

                    // Auxiliary functions to decrypt the message
                    async function getPrivateKey() {
                        const db = await openDatabase();

                        return new Promise((resolve, reject) => {
                            const transaction = db.transaction("PrivateKeys", "readonly");
                            const store = transaction.objectStore("PrivateKeys");
                            const request = store.get("userPrivateKey");

                            request.onsuccess = (event) => {
                                if (event.target.result) {
                                    resolve(event.target.result.key);
                                } else {
                                    reject("Private key not found in IndexedDB.");
                                }
                            };

                            request.onerror = (event) => {
                                reject("Error retrieving private key: " + event.target.error);
                            };
                        });
                    }

                    async function importPrivateKey(base64Key) {
                        const binaryKey = Uint8Array.from(atob(base64Key), (char) => char.charCodeAt(0));
                        return await crypto.subtle.importKey(
                            "pkcs8",
                            binaryKey.buffer,
                            {
                                name: "RSA-OAEP",
                                hash: "SHA-256",
                            },
                            true,
                            ["decrypt"]
                        );
                    }

                    async function decryptMessageFromPrivateKey(encryptedMessageBase64) {
                        try {
                            const privateKeyBase64 = await getPrivateKey();
                            const privateKey = await importPrivateKey(privateKeyBase64);

                            const encryptedMessage = Uint8Array.from(
                                atob(encryptedMessageBase64),
                                (char) => char.charCodeAt(0)
                            );

                            const decryptedBuffer = await crypto.subtle.decrypt(
                                {
                                    name: "RSA-OAEP",
                                },
                                privateKey,
                                encryptedMessage
                            );

                            const decoder = new TextDecoder();
                            return decoder.decode(decryptedBuffer);
                        } catch (error) {
                            console.error("Error decrypting message:", error);
                            throw error;
                        }
                    }

                    function openDatabase() {
                        return new Promise((resolve, reject) => {
                            const request = indexedDB.open("MyTestDatabase", 3);

                            request.onsuccess = (event) => {
                                resolve(event.target.result);
                            };

                            request.onerror = (event) => {
                                reject("Error opening IndexedDB: " + event.target.error);
                            };
                        });
                    }
                </script>


            @else
                <div class="center">
                    <p>Please log in to access the chat features.</p>
                </div>
                <div class="center">
                    <div id="login-register">
                        <button>
                            <a href="{{ route('login') }}">Log in</a>
                        </button>
                        @if (Route::has('register'))
                            <button>
                                <a href="{{ route('register') }}">Register</a>
                            </button>
                        @endif
                    </div>
                </div>
            @endauth
        </nav>
    @endif
@endsection
