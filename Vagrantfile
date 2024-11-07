# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.ssh.insert_key = false

  config.vm.box = "debian/bookworm64"

  config.vm.define "server" do |s|
    s.vm.hostname = "server"
    s.vm.network "forwarded_port", guest: 80, host: 80
    s.vm.network "forwarded_port", guest: 443, host: 443
    s.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    apt-get install -y apache2
    cp -v /vagrant/apache2.conf /etc/apache2
  SHELL
  end
end
