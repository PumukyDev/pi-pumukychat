# Variables
INVENTORY = ./ansible/hosts
PLAYBOOK = ./ansible/playbooks/main.yml

# Main goal: Start the virtual machine
all: up

# Starts the virtual machine defined in the Vagrantfile and provisions it
up:
	@echo "==> Starting virtual machine with Vagrant..."
	vagrant up || { echo "vagrant up failed, retrying..."; sleep 10; vagrant up; }

	@echo "==> Removing conflicting keys from known_hosts (if any)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true

	@echo "==> Waiting 30 seconds..."
	@sleep 30

	@echo "==> Running Ansible Playbook..."
	ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ./ansible/hosts ./ansible/playbooks/main.yml || { echo "Ansible Playbook failed, retrying..."; sleep 10; ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ./ansible/hosts ./ansible/playbooks/main.yml; }

# Stops the virtual machine
halt:
	@echo "==> Stopping virtual machine..."
	vagrant halt

# Destroys the virtual machine
destroy:
	@echo "==> Destroying virtual machine..."
	vagrant destroy -f

# Runs the Ansible playbook
provision:
	@echo "==> Removing conflicting keys from known_hosts (if any)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true
	@echo "==> Running Ansible Playbook..."
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK)

# Cleans up temporary files and prepares for a new environment
clean:
	@echo "==> Cleaning environment..."
	vagrant destroy -f
	rm -rf .vagrant
	rm -f *.retry
	@echo "==> Removing keys from known_hosts (if any)..."
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[127.0.0.1]:2222" || true
	@ssh-keygen -f "/home/adrian/.ssh/known_hosts" -R "[192.168.1.202]:2222" || true

# Validate dependencies
validate:
	@which vagrant > /dev/null || (echo "Vagrant is not installed. Please install it before continuing." && exit 1)
	@which ansible-playbook > /dev/null || (echo "Ansible is not installed. Please install it before continuing." && exit 1)

.PHONY: all up halt destroy provision clean validate
