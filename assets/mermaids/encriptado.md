[mermaid]
----
sequenceDiagram
    participant A as Usuario A (Remitente)
    participant B as Usuario B (Receptor)
    participant S as Servidor

    A->>B: Envía mensaje por websocket
    Note over A: Genera clave AES 256 bits e IV de 12 bytes
    A->>A: Cifra mensaje con AES + IV
    A->>A: Cifra AES + IV con la clave pública (RSA) de A y B

    A->>S: Envía mensaje cifrado y AES + IV cifrados
    S->>S: Almacena mensaje en `messages` y cada una de las claves cifradas en `message_keys`
----