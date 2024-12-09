#!/bin/bash

source .env

response=$(curl -s -X "GET" \
  "https://api.hosting.ionos.com/dns/v1/zones/$zoneId/records/$recordId" \
  -H "accept: application/json" \
  -H "X-API-Key: $ID.$SecretKey")

# Extraer y limpiar el contenido del campo 'content'
url=$(echo "$response" | jq -r '.content | gsub("\""; "")')

echo "$url"
