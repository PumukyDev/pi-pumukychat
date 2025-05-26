sequenceDiagram
    participant Cliente
    participant Servidor

    Cliente->>Servidor: Solicita cambio a WebSocket(Upgrade)
    Note right of Servidor: La conexión se abre
    Servidor-->>Cliente: Respuesta 101 Switching Protocols

    Cliente<<-->>Servidor: Envía mensajes
    Note over Cliente,Servidor: Comunicación bidireccional continua

    Cliente-->>Servidor: Cierre de la conexión
    Note over Cliente,Servidor: La conexión se cierra