---
config:
  theme: default
---
flowchart TD
    subgraph Internet
        User[Usuario]
    end

    subgraph DNS
        IONOS[DNS de IONOS]
    end

    subgraph Servidor
        dyndns[dyndns]
        nginx[nginx_proxy]
        chat[nginx_chat]
        otros[nginx_X]
    end

    %% Acceso del usuario
    User -->|chat.pumukydev.com| IONOS
    IONOS -->|IP del servidor| User
    User -->|HTTPS| nginx
    nginx -->|redirige| chat
    nginx -->|redirige| otros

    %% Actualización DNS
    dyndns -->|actualiza IP cada minuto| IONOS
