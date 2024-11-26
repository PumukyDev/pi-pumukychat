# Monitoring

This folder contains configurations and files for the monitoring tools used in the project. It includes setups for **Grafana** and **Prometheus**, with a flexible structure that allows easy integration of additional tools such as Loki, Suricata, and more in the future.

---

## Tools Included

### 1. Grafana
Grafana is a data visualization and analytics platform that allows you to monitor and analyze metrics from systems, applications, and services in real time.

#### **Key Features:**
- **Visualization:** Interactive and customizable dashboards with graphs, tables, and heatmaps.
- **Integration:** Seamless support for data sources such as Prometheus, Loki, Elasticsearch, and others.
- **Alerting:** Configure alerts based on specific conditions to notify through email, Slack, or other channels.
- **Extensibility:** Support for plugins, pre-built dashboards, and community-shared panels.

#### **Configuration Files:**
- **`grafana.ini`**: The main configuration file for Grafana. Includes settings for server, authentication, and plugins.
- **`dashboard.yml`**: Configures default dashboards to be loaded automatically upon startup.
- **`datasources.yml`**: Defines the data sources used by Grafana, such as Prometheus.
- **`dashboard.json`**: A pre-configured dashboard template for visualizing metrics.

#### **Access URL:**
After starting the Grafana service, it is accessible at:
http://localhost:3000


---

### 2. Prometheus
Prometheus is a powerful monitoring and alerting toolkit optimized for time-series data. It collects and stores metrics, allowing users to query and create visualizations in Grafana.

#### **Configuration File:**
- **`prometheus.yml`**: The main configuration file for Prometheus, defining scrape targets and alert rules.

---

## Structure

- **`grafana/`**: Contains Grafana's configuration files and predefined dashboards.
- **`images/`**: Screenshots demonstrating Grafana and Prometheus setups for reference.
- **`prometheus/`**: Holds Prometheus configuration files.

---

## Installation and Setup

### **Graphical Installation**
To configure monitoring tools using the graphical interface, follow these steps:

1. **Login to Grafana**:
   <div align="center">
       <img src="images/grafana_login.jpg" alt="Grafana Login Page"/>
   </div>

2. **Change Default Password**:
   <div align="center">
       <img src="images/grafana_change_passwd.jpg" alt="Change Grafana Password"/>
   </div>

3. **Add Prometheus as a Data Source**:
   <div align="center">
       <img src="images/grafana_prometheus.jpg" alt="Add Prometheus as Data Source"/>
   </div>

4. **Configure Prometheus in Grafana**:
   <div align="center">
       <img src="images/prometheus_add_source.jpg" alt="Prometheus Settings"/>
   </div>
   <div align="center">
       <img src="images/prometheus_settings.jpg" alt="Configure Prometheus"/>
   </div>

5. **Verify Setup**: 
   Once the setup is complete, a successful connection will look like this:
   <div align="center">
       <img src="images/prometheus_succed.jpg" alt="Prometheus Connection Success"/>
   </div>

6. **View Dashboards**:
   Use pre-configured dashboards or create your own:
   <div align="center">
       <img src="images/grafana_graph.jpg" alt="Grafana Graph Example"/>
   </div>

---

### **Automated Installation**
This project leverages **Vagrant** and **Ansible** for automation. The monitoring stack is pre-configured to run seamlessly in the development environment.

1. **Set up environment**:
   Ensure Vagrant and Ansible are properly installed on your system.

2. **Run provisioning**:
   Execute the following command to start the virtual machines and set up monitoring tools automatically:
   ```bash
   vagrant up


### Access the Tools

- **Grafana**: [http://localhost:3000](http://localhost:3000)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)

---

## Future Additions

- **Loki**: For log aggregation.
- **Suricata**: For intrusion detection.
- **Node Exporter**: For server metrics monitoring.

This structure ensures flexibility and scalability to accommodate further enhancements.

---

## Notes

- Make sure configuration files (`grafana.ini`, `prometheus.yml`, etc.) are correctly updated for your specific environment.
- For security reasons, sensitive files like authentication details should be stored securely and not included in the repository.







AÑADIR


prometheus.yml  en este archivo se configura prometheus. Puedes encontrar la configuración inicial en /etc/prometheus/