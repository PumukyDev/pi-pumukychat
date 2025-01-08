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

    const keyPair = await generateECDHKeys(); // Genera las claves
    const publicKeyBase64 = await exportKey(keyPair.publicKey, "spki"); // Exporta la clave pública
    const privateKeyBase64 = await exportKey(keyPair.privateKey, "pkcs8"); // Exporta la clave privada

    // Muestra las claves en la consola del navegador
    console.log("Clave pública (Base64):", publicKeyBase64);
    console.log("Clave privada (Base64):", privateKeyBase64);
});
