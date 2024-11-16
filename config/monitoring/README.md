# Monitoring

This folder contains configurations and files for the monitoring tools used in the project. Currently, it includes configurations for **Grafana** and **Prometheus**, and is prepared for future additions like Loki, Suricata, and more.

---

## Grafana
Grafana is a data visualization and analytics platform designed to monitor and understand metrics from systems, applications, and services.

#### Key Features:
- **Visualization:** Create interactive and customizable dashboards with graphs, tables, and alerts.
- **Integration:** Supports multiple data sources such as Prometheus, Loki, Elasticsearch, and others.
- **Alerting:** Define alerts based on specific conditions, which can be sent to channels like Slack, email, and more.
- **Extensibility:** Supports plugins, pre-built dashboards, and community-shared panels.

#### **Configuration Files:**
- `grafana.ini`: Main configuration file where server settings, authentication, and plugin paths are defined.
- `...`

#### **Access URL:**
By default, Grafana is accessible at `http://localhost:3000` after starting the service.

### Instalation
...

<div align="center">
    <img src="images/grafana_login.jpg" alt="grafana login page"/>
</div>

...

---
