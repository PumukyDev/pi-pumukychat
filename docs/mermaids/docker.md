[mermaid]
-----
flowchart TD
    subgraph Internet
        browser["💻 Navegador Web"]
    end

    browser -. :80 / :443 .-> nginx_proxy

    subgraph NGINX_PROXY ["Red proxy-network"]
        nginx_proxy["Nginx Proxy"]
        nginx_proxy -. :80 .-> nginx_chat["Nginx Chat"]
        nginx_proxy -. :80 .-> nginx_streaming["Others Nginx"]
    end

    %% Redirecciones desde nginx_proxy


    %% Contenedor de Nginx Chat - reparte tráfico
    subgraph CHAT_STACK ["Chat App (proxy-network + mysql-network)"]
        nginx_chat -. :80 .-> app_chat["Laravel (HTTPS)"]
        nginx_chat <-. :8082 .-> reverb_chat["Reverb (WebSocket)"]
        app_chat -. :8082 .-> reverb_chat
        app_chat --> queue_chat["Queue Worker"]
        queue_chat -. :8082 .-> reverb_chat
        queue_chat -. :3306 .-> database_chat
        app_chat -. :3306 .-> database_chat["🗄️ MariaDB"]
    end

    %% PHPMyAdmin
    subgraph RED_LOCAL ["Red local"]
        navegador_local["🧑‍💻 Navegador Local"] -. :8080 .-> phpmyadmin["PhpMyAdmin"]
    end
    phpmyadmin -. :3306 .-> database_chat

    %% Redes (estéticas)
    classDef net_proxy fill:#f0f0ff,stroke:#aaa,stroke-width:1px;
    classDef net_mysql fill:#f9fff0,stroke:#aaa,stroke-width:1px;

    class NGINX_PROXY net_proxy;
    class CHAT_STACK net_mysql;
-----