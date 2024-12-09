# Variables
ANSIBLE_PLAYBOOK = ansible-playbook
INVENTORY = ./ansible/hosts
PLAYBOOK = ./ansible/playbooks/main.yml

# Objetivo principal: Levantar la máquina virtual
all: up

# Levanta la máquina virtual definida en el Vagrantfile y provisiona
up:
	@echo "==> Iniciando máquina virtual con Vagrant..."
	vagrant up || { echo "vagrant up falló, reintentando..."; sleep 10; vagrant up; }

	@echo "==> Eliminando claves conflictivas de known_hosts (si existen)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true

	@echo "==> Esperando 30 segundos..."
	@sleep 30

	@echo "==> Ejecutando Ansible Playbook..."
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ./ansible/hosts ./ansible/playbooks/main.yml || { echo "Ansible Playbook falló, reintentando..."; sleep 10; ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ./ansible/hosts ./ansible/playbooks/main.yml; }

# Apaga la máquina virtual
halt:
	@echo "==> Apagando máquina virtual..."
	vagrant halt

# Elimina la máquina virtual
destroy:
	@echo "==> Eliminando máquina virtual..."
	vagrant destroy -f

# Corre el playbook de Ansible
provision:
	@echo "==> Eliminando claves conflictivas de known_hosts (si existen)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true
	@echo "==> Ejecutando Ansible Playbook..."
	$(ANSIBLE_PLAYBOOK) -i $(INVENTORY) $(PLAYBOOK)

# Limpia archivos temporales y deja todo listo para un nuevo entorno
clean:
	@echo "==> Limpiando entorno..."
	vagrant destroy -f
	rm -rf .vagrant
	rm -f *.retry
	@echo "==> Eliminando claves de known_hosts (si existen)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true

# Validar dependencias (opcional)
validate:
	@which vagrant > /dev/null || (echo "Vagrant no está instalado. Por favor instálalo antes de continuar." && exit 1)
	@which ansible-playbook > /dev/null || (echo "Ansible no está instalado. Por favor instálalo antes de continuar." && exit 1)

.PHONY: all up halt destroy provision clean validate
