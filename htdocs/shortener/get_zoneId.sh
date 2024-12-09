#!/bin/bash

source .env

zoneInfo=$(
        curl -s -X 'GET' \
        'https://api.hosting.ionos.com/dns/v1/zones' \
        -H "accept: application/json" \
        -H "X-API-Key: $ID.$SecretKey"
    )

# Extract only the id
zoneId=$(echo "$zoneInfo" | jq -r '.[0].id')

# Verify if the extraction was successful
if [[ -n "$zoneId" ]]; then
    echo "zoneId=$zoneId" >> .env
    echo "zoneId=$zoneId"
else
    echo "Error: can't get the zone id."
    echo "Info: $zoneInfo"
fi
