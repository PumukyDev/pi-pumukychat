Vagrant.configure("2") do |config|
  # Basic configuration
  config.vm.box_check_update = false
  config.vm.box = "debian/bookworm64"

  # System resources
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
    vb.memory = "16000"
    vb.cpus = 10
  end
  
  # Network configuration
  config.vm.define "server" do |s|
    s.vm.network "public_network", ip: "192.168.1.202", bridge: "enp4s0"
  end

  config.vm.provision "shell", inline: <<-SCRIPT
    timedatectl set-timezone Europe/Madrid
    ip route replace default via 192.168.1.1 dev eth1
  SCRIPT

  # SSH configuration for ansible provision
  config.ssh.insert_key = false  
  config.ssh.private_key_path = [File.expand_path("~/.vagrant.d/insecure_private_key"), File.expand_path("~/.ssh/id_rsa")]
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

end
