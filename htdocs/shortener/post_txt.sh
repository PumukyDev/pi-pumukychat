#!/bin/bash

source .env

# Obtiene los parámetros
short_hash=$1
long_url=$2

# Realiza la petición para registrar el TXT record
curl -X "POST" \
    "https://api.hosting.ionos.com/dns/v1/zones/$zoneId/records" \
    -H "accept: application/json" \
    -H "X-API-Key: $ID.$SecretKey" \
    -H "Content-Type: application/json" \
    -d "[
         {
             \"name\": \"${short_hash}.url-shortener.pumukydev.com\",
             \"type\": \"TXT\",
             \"content\": \"${long_url}\",
             \"ttl\": 3600,
             \"prio\": 0,
             \"disabled\": false
         }
     ]"
