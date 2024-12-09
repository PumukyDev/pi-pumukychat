Vagrant.configure("2") do |config|
  config.vm.box_check_update = false
  config.ssh.insert_key = false  

  config.vm.box = "debian/bookworm64"

  # Configuración de claves SSH
  config.ssh.private_key_path = [File.expand_path("~/.vagrant.d/insecure_private_key"), File.expand_path("~/.ssh/id_rsa")]

  # Provisionamiento de la clave pública
  config.vm.provision :shell, privileged: false do |s|
    ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
    s.inline = <<-SHELL
      mkdir -p /home/vagrant/.ssh
      echo #{ssh_pub_key} >> /home/vagrant/.ssh/authorized_keys
      sudo bash -c "mkdir -p /root/.ssh && echo #{ssh_pub_key} >> /root/.ssh/authorized_keys"
      sudo cp /vagrant/config/ssh/sshd_config /etc/ssh/sshd_config
      sudo systemctl restart ssh
    SHELL
  end

  config.vm.define "server" do |s|
    s.vm.network "public_network", ip: "192.168.1.202", bridge: "enp4s0"
    #s.vm.network "public_network", ip: "10.112.40.8", bridge: "enx207bd2ab0a43"
    s.vm.network "forwarded_port", guest: 80, host: 8080
    s.vm.network "forwarded_port", guest: 443, host: 4433
    s.vm.network "forwarded_port", guest: 3000, host: 3000
    s.vm.network "forwarded_port", guest: 9090, host: 9090
    s.vm.network "forwarded_port", guest: 22, host: 2223

  end
end
