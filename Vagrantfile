# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.ssh.insert_key = false

  config.vm.box = "debian/bookworm64"

  config.vm.define "server" do |s|
    s.vm.hostname = "server"
    s.vm.network "public_network", ip: "192.168.57.10", bridge: "eth0"
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
      cp -r /vagrant/config/monitoring/grafana /etc/grafana/
      systemctl restart grafana-server
      apt-get install -y prometheus
      systemctl restart prometheus
  SHELL
  end
end
