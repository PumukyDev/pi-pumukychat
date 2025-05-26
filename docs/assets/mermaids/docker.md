---
config:
  layout: fixed
  theme: neo
---
flowchart TD
 subgraph contendores_chat["Chat"]
        nginx_chat["Nginx Chat"]
        app_chat["Laravel"]
        reverb_chat["Reverb"]
        queue_chat["Queue Worker"]
        database_chat[("MariaDB")]
        phpmyadmin["PhpMyAdmin"]
  end
 subgraph contenedores_docker["Contenedores Docker"]
        nginx_proxy["Nginx Proxy"]
        nginx_otros["Others Nginx"]
        contendores_chat
  end
    navegador["Navegador"] -. :80 / :443 .-> nginx_proxy
    navegador_local["Navegador Local"] -. :8080 .-> phpmyadmin
    nginx_proxy -. :80 .-> nginx_chat & nginx_otros
    nginx_chat -. :80 .-> app_chat
    nginx_chat -. :8082 .-> reverb_chat
    app_chat -.-> queue_chat
    queue_chat -. :8082 .- reverb_chat
    queue_chat -. :3306 .-> database_chat
    app_chat -. :3306 .-> database_chat
    phpmyadmin -. :3306 .-> database_chat
    n1["http"]
    n2["ws"]
    n1@{ shape: text}
    n2@{ shape: text}
    classDef net_proxy fill:#f0f0ff,stroke:#aaa,stroke-width:1px
    classDef net_mysql fill:#f9fff0,stroke:#aaa,stroke-width:1px