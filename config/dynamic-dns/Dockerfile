FROM debian:12.8

# Install required packages
RUN apt-get update && apt-get -y install cron curl jq

# Set working directory to /opt/dynamic-dns
WORKDIR /opt/dynamic-dns

# Copy your script and necessary files into the container
COPY update-ip.sh /opt/dynamic-dns/
COPY get-url.sh /opt/dynamic-dns/
COPY dyndns-cronjob /etc/cron.d/

# Set correct permissions for the script and cronjob
RUN chmod +x /opt/dynamic-dns/update-ip.sh
RUN chmod 0644 /etc/cron.d/dyndns-cronjob

# Install the cron job
RUN crontab /etc/cron.d/dyndns-cronjob

# Run cron in the foreground
CMD ["cron", "-f"]
