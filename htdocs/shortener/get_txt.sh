#!/bin/bash

source .env

curl -X "GET" \
  "https://api.hosting.ionos.com/dns/v1/zones/$zoneId/records/$recordId" \
  -H "accept: application/json" \
  -H "X-API-Key: $ID.$SecretKey" \
