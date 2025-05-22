[mermaid]
----
sequenceDiagram
    participant U as Usuario
    participant S as Servidor
    Note over U: Usuario se registra

    U->>U: Genera par de claves RSA
    U->>U: Exporta clave pública y clave privada (PEM)
    U->>U: Guarda clave privada en IndexedDB
    U->>S: Envía clave pública al servidor
    S->>S: Almacena clave pública en la base de datos (tabla `users`)
----