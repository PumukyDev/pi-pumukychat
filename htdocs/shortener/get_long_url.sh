#!/bin/bash

source .env

url="https://dns.google/resolve?name=$short_hash.url-shortener.pumukydev.com&type=TXT"

# Realiza la consulta a la API de Google DNS
response=$(curl -s "$url")

# Verifica si hay respuestas válidas y extrae el último valor de 'data'
last_data=$(echo "$response" | jq -r '.Answer | select(. != null) | .[-1].data')

if [ -z "$last_data" ]; then
  echo "No se encontraron registros TXT para $short_hash.url-shortener.pumukydev"
else
  # Elimina las comillas dobles del valor extraído
  echo "${last_data//\"/}"
fi
