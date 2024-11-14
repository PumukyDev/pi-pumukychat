# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.ssh.insert_key = false

  config.vm.box = "debian/bookworm64"

  config.vm.define "server" do |s|
    s.vm.hostname = "server"
    s.vm.network "public_network", ip: "192.168.57.10", bridge: "eth0"
    s.vm.network "forwarded_port", guest: 80, host: 8080
    s.vm.network "forwarded_port", guest: 443, host: 4433
    s.vm.provision "shell", inline: <<-SHELL
      apt-get update -y
      apt-get install -y apache2 curl php libapache2-mod-php
      cp -vr /vagrant/config/apache2/ /etc/
      cp -vr /vagrant/htdocs/ /var/www/
      sudo a2ensite pumukydev.conf
      systemctl restart apache2
  SHELL
  end
end
