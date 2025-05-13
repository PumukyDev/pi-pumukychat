const DB_NAME = 'SecureChatKeys';
const STORE_NAME = 'keys';

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

export function arrayBufferToPem(buffer, label) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = btoa(binary);
    const lines = base64.match(/.{1,64}/g);
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

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
 * Converts base64 to Uint8Array with validation.
 */
function base64ToUint8Array(base64) {
    try {
        const binary = atob(base64);
        return Uint8Array.from(binary, c => c.charCodeAt(0));
    } catch (e) {
        console.error("❌ Invalid base64 data:", base64);
        throw e;
    }
}

/**
 * Decrypts a base64-encoded AES-encrypted message.
 * Assumes the format: iv:content (both base64).
 */
export async function decryptMessageAES(encryptedBase64, aesKey) {
    console.debug("🔐 decryptMessageAES() input:", encryptedBase64);

    if (!encryptedBase64.includes(":")) {
        throw new Error("Encrypted message missing ':' separator between IV and ciphertext");
    }

    const [ivB64, contentB64] = encryptedBase64.split(":");

    if (!ivB64 || !contentB64) {
        throw new Error("Invalid encrypted message format. IV or content missing.");
    }

    const iv = base64ToUint8Array(ivB64);
    const ciphertext = base64ToUint8Array(contentB64);

    console.debug("🔐 Decryption attempt → IV:", iv, "Ciphertext length:", ciphertext.length);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        aesKey,
        ciphertext
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    console.debug("✅ Decrypted message:", decryptedText);
    return decryptedText;
}
