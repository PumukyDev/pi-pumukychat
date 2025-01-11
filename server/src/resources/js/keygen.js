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

    // Save the private key into IndexedDB
    const savePrivateKeyToIndexedDB = () => {
        // Open or create the database
        const request = window.indexedDB.open("MyTestDatabase", 3);

        // Create the object store if it doesn't exist
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("PrivateKeys")) {
                db.createObjectStore("PrivateKeys", { keyPath: "id" });
            }
        };

        // Successful operation: save the private key
        request.onsuccess = (event) => {
            const db = event.target.result;

            // Start a write transaction
            const transaction = db.transaction("PrivateKeys", "readwrite");
            const store = transaction.objectStore("PrivateKeys");

            // Create the object to store
            const keyEntry = { id: "userPrivateKey", key: privateKeyBase64 };

            // Save it in the object store
            const addRequest = store.put(keyEntry);

            addRequest.onsuccess = () => {
                console.log("Private key saved in IndexedDB.");
            };

            addRequest.onerror = (error) => {
                console.error("Error saving the private key in IndexedDB:", error);
            };
        };

        // Handle errors while opening the database
        request.onerror = (error) => {
            console.error("Error opening IndexedDB:", error);
        };
    };

    // Call the function to save the private key
    savePrivateKeyToIndexedDB();
});
