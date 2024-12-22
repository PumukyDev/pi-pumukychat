> [!WARNING]  
> I'm currently migrating the configuration from Vagrant + Ansible to Docker. You may encounter some inconsistencies or incomplete setups during this transition.

# Dynamic DNS

This directory contains the necessary configuration and scripts to enable dynamic DNS updates for your domain using IONOS's DynDNS service. These updates ensure that your domain always points to your current public IP address, even if it changes.

## Structure

- **`dyndns-cronjob`**: Configuration or scripts to automate the DynDNS update process through a cron job.
- **`get_url`**: Scripts used to make the API request to IONOS DynDNS.
  - **`dyndns.sh`**: Bash script to perform the DNS update by sending a `curl` request to the DynDNS API.
  - **`.env`**: Environment file where sensitive data such as your API key is stored (not included in this repository).

## Usage

1. **Set up the `.env` file:**
   Create a `.env` file inside the `get_url` directory with the following structure:
   ```env
    ID=your_ionos_id
    SecretKey=your_ionos_secret_key