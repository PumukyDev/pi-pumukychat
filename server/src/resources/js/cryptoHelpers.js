// resources/js/cryptoHelpers.js

const DB_NAME = 'SecureChatKeys';
const STORE_NAME = 'keys';

/**
 * Converts a PEM-encoded string to an ArrayBuffer.
 */
export function pemToArrayBuffer(pem) {
    const base64 = pem
        .replace(/-----BEGIN .*-----/, '')
        .replace(/-----END .*-----/, '')
        .replace(/\s/g, '');
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
    }
    return buffer;
}

/**
 * Converts an ArrayBuffer to a PEM-formatted string.
 */
export function arrayBufferToPem(buffer, label) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = btoa(binary);
    const lines = base64.match(/.{1,64}/g);
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

/**
 * Store the private key PEM in IndexedDB under the 'SecureChatKeys' database.
 */
export function storePrivateKeyPem(pem) {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
    };

    request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id: 'private_key', pem });
        tx.oncomplete = () => db.close();
    };

    request.onerror = () => {
        console.error('❌ Failed to open IndexedDB:', request.error);
    };
}

/**
 * Load and import the private RSA key from IndexedDB.
 */
export function loadPrivateKey() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const getRequest = store.get('private_key');

            getRequest.onsuccess = async () => {
                const result = getRequest.result;
                if (!result) {
                    console.warn("🔍 No private key found in store:", getRequest);
                    reject('No private key found in IndexedDB');
                    db.close();
                    return;
                }

                try {
                    const keyBuffer = pemToArrayBuffer(result.pem);
                    const privateKey = await window.crypto.subtle.importKey(
                        'pkcs8',
                        keyBuffer,
                        { name: 'RSA-OAEP', hash: 'SHA-256' },
                        true,
                        ['decrypt']
                    );
                    resolve(privateKey);
                } catch (err) {
                    reject(err);
                }

                tx.oncomplete = () => db.close();
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/**
 * Decrypt AES key using the RSA private key.
 */
export async function decryptAESKeyWithPrivateKey(encryptedBase64, privateKey) {
    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const aesKeyBuffer = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        encryptedBuffer
    );

    return await window.crypto.subtle.importKey(
        'raw',
        aesKeyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );
}

/**
 * Decrypts a base64-encoded AES-encrypted message.
 * Assumes IV is prepended to the ciphertext (first 12 bytes).
 */
export async function decryptMessageAES(encryptedBase64, aesKey) {
    console.debug("🔐 decryptMessageAES() input:", encryptedBase64);

    if (!encryptedBase64.includes(":")) {
        throw new Error("Encrypted message missing ':' separator between IV and ciphertext");
    }

    const [ivB64, contentB64] = encryptedBase64.split(":");

    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(contentB64), c => c.charCodeAt(0));

    console.debug("🔐 IV (base64):", ivB64, "IV (bytes):", iv);
    console.debug("🔐 Ciphertext (base64):", contentB64);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        aesKey,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}
