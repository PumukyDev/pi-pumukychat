# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.ssh.insert_key = false

  config.vm.box = "debian/bookworm64"

  config.vm.define "server" do |s|
    s.vm.hostname = "server"
    s.vm.network "public_network", ip: "192.168.1.202", bridge: "eth0"
    #s.vm.network "public_network", ip: "10.112.40.2", bridge: "eth0"
    s.vm.network "forwarded_port", guest: 80, host: 8080
    s.vm.network "forwarded_port", guest: 443, host: 4433
    s.vm.network "forwarded_port", guest: 3000, host: 3000
    s.vm.network "forwarded_port", guest: 9090, host: 9090
    s.vm.provision "shell", inline: <<-SHELL
      apt-get update -y
      apt-get install -y apache2 curl php libapache2-mod-php gnupg jq
      cp -vr /vagrant/config/apache2/ /etc/
      cp -vr /vagrant/htdocs/ /var/www/
      sudo a2ensite pumukydev.conf
      sudo a2enmod ssl
      sudo a2enmod proxy
      sudo a2enmod proxy_http
      sudo a2enmod headers
      cp -r /vagrant/config/dynamic-dns/get_url/ /opt/dynamic-dns/
      chmod +x /opt/dynamic-dns/dyndns.sh
      cp /vagrant/config/dynamic-dns/dyndns-cronjob /etc/cron.d/
      systemctl restart apache2
      sudo apt install -y gnupg2 software-properties-common apt-transport-https wget
      sudo mkdir -p /etc/apt/keyrings/
      wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
      echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
      sudo apt-get update -y
      sudo apt-get install grafana -y
      cp /vagrant/config/monitoring/grafana/grafana.ini /etc/grafana/
      #cp /vagrant/config/monitoring/prometheus/prometheus.yml /etc/prometheus/
      systemctl restart grafana-server
      #apt-get install -y prometheus
      #systemctl restart prometheus
      systemctl restart apache2
      curl -s https://api.github.com/repos/Lusitaniae/apache_exporter/releases/latest|grep browser_download_url|grep linux-amd64|cut -d '"' -f 4|wget -qi -
      tar xvf apache_exporter-*.linux-amd64.tar.gz
      sudo cp apache_exporter-*.linux-amd64/apache_exporter /usr/local/bin
      sudo chmod +x /usr/local/bin/apache_exporter
      sudo groupadd --system prometheus
      sudo useradd -s /sbin/nologin --system -g prometheus prometheus
      cp /vagrant/apache_exporter.service /etc/systemd/system/apache_exporter.service
      sudo systemctl daemon-reload
      sudo systemctl restart apache_exporter.service
      apt install prometheus -y
      cp /vagrant/config/monitoring/prometheus/prometheus.yml /etc/prometheus/
      sudo systemctl restart prometheus
       # Crear carpetas para dashboards
      mkdir -p /var/lib/grafana/dashboards
      mkdir -p /etc/grafana/provisioning/dashboards

      # Copiar el dashboard
      cp /vagrant/config/monitoring/grafana/dashboard.json /var/lib/grafana/dashboards/
      cp /vagrant/config/monitoring/grafana/dashboard.yml /etc/grafana/provisioning/dashboards/

      # Configurar el provisioning
      cat <<EOF > /etc/grafana/provisioning/dashboards/dashboard.yml
apiVersion: 1
providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: 'file'
    disableDeletion: false
    editable: false
    options:
      path: /var/lib/grafana/dashboards
EOF
    sudo chown grafana:grafana /var/lib/grafana/dashboards/dashboard.json
    sudo chmod 644 /var/lib/grafana/dashboards/dashboard.json
    sudo systemctl restart grafana-server
    # Crear el directorio de provisión de Grafana si no existe
    sudo mkdir -p /etc/grafana/provisioning/datasources

    # Copiar el archivo de configuración YAML desde el host
    sudo cp /vagrant/config/monitoring/grafana/datasources.yml /etc/grafana/provisioning/datasources/

    # Reiniciar Grafana para aplicar la configuración
    sudo systemctl restart grafana-server
  SHELL
  end
end
