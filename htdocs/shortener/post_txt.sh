#!/bin/bash

source .env

curl -X "POST" \
    "https://api.hosting.ionos.com/dns/v1/zones/$zoneId/records" \
    -H "accept: application/json" \
    -H "X-API-Key: $ID.$SecretKey" \
    -H "Content-Type: application/json" \
    -d "[
         {
             \"name\": \"$short_hash.url-shortener.pumukydev.com\",
             \"type\": \"TXT\",
             \"content\": \"$long_url\",
             \"ttl\": 3600,
             \"prio\": 0,
             \"disabled\": false
         }
     ]"
