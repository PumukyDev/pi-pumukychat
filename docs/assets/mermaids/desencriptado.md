[mermaid]
----
sequenceDiagram
    participant B as Usuario B (Receptor)
    participant S as Servidor

    B->>S: Solicita mensajes de la conversación
    S->>B: Envía: mensajes cifrados y AES + IV cifrados

    Note over B: Carga su clave privada (RSA) desde IndexDB
    B->>B: Descifra clave AES + IV con su clave privada
    B->>B: Descifra mensaje con AES + IV
    B->>B: Muestra mensaje descifrado en pantalla
----