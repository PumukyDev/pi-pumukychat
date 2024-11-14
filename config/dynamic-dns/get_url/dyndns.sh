#!/bin/bash

source /opt/dynamic-dns/.env
curl -X 'POST' \
  'https://api.hosting.ionos.com/dns/v1/dyndns' \
  -H "accept: application/json" \
  -H "X-API-Key: $ID.$SecreyKey" \
  -H "Content-Type: application/json" \
  -d '{
  "domains": [
    "pumukydev.com",
    "www.pumukydev.com"
  ],
  "description": "Dynamic DNS"
}'
