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
                <ul>
                    @foreach ($messages as $message)
                        <li>
                                {{ $message->message }}
                            </a>
                        </li>
                    @endforeach
                </ul>

                <!-- Form to manually insert the encrypted message and decypher it -->
                <div class="center">
                    <h2>Decrypt a Message</h2>
                    <textarea id="encryptedMessage" placeholder="Paste the encrypted message here..."></textarea><br>
                    <button onclick="decryptMessage()">Decrypt Message</button>
                    <p id="decryptedMessage"></p>
                </div>

                <!-- Script to decrypt the message -->
                <script>
                    async function decryptMessage() {
                        const encryptedMessageBase64 = document.getElementById("encryptedMessage").value;

                        try {
                            const decryptedMessage = await decryptMessageFromPrivateKey(encryptedMessageBase64);
                            document.getElementById("decryptedMessage").innerText = "Decrypted Message: " + decryptedMessage;
                        } catch (error) {
                            document.getElementById("decryptedMessage").innerText = "Error decrypting message: " + error.message;
                        }
                    }

                    // Get the private key from IndexedDB
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

                    // Import the private key into SubtleCrypto
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

                    // Decrypt the message using the private key
                    async function decryptMessageFromPrivateKey(encryptedMessageBase64) {
                        try {
                            // Get the private key
                            const privateKeyBase64 = await getPrivateKey();

                            // Import the private key
                            const privateKey = await importPrivateKey(privateKeyBase64);

                            // Convert the key from Base64 to ArrayBuffer
                            const encryptedMessage = Uint8Array.from(
                                atob(encryptedMessageBase64),
                                (char) => char.charCodeAt(0)
                            );

                            // Decrypt the message
                            const decryptedBuffer = await crypto.subtle.decrypt(
                                {
                                    name: "RSA-OAEP",
                                },
                                privateKey,
                                encryptedMessage
                            );

                            // Convert the result to a text string
                            const decoder = new TextDecoder();
                            return decoder.decode(decryptedBuffer);
                        } catch (error) {
                            console.error("Error decrypting message:", error);
                            throw error;
                        }
                    }

                    // Open again the IndexedDB database
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
