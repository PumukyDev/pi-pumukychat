document.addEventListener('DOMContentLoaded', async () => {
    const generateECDHKeys = async () => {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256",
            },
            true,
            ["deriveKey", "deriveBits"]
        );
        return keyPair;
    };

    const exportKey = async (key, format) => {
        const exported = await crypto.subtle.exportKey(format, key);
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    };

    // Generate key pair
    const keyPair = await generateECDHKeys();
    const publicKeyBase64 = await exportKey(keyPair.publicKey, "spki");
    const privateKeyBase64 = await exportKey(keyPair.privateKey, "pkcs8");

    // Send the public key to the server
    const publicKeyField = document.getElementById("public_key");
    publicKeyField.value = publicKeyBase64;
});
