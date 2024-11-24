<?php
// Obtiene el hash desde el parámetro 'hash' en la URL
if (!isset($_GET['hash'])) {
    header("HTTP/1.1 400 Bad Request");
    echo "Hash no especificado.";
    exit;
}

$short_hash = $_GET['hash'];  // Esto debería contener el valor 'e75652'

// Construye la URL del servicio de Google para consultar el TXT record
$dns_query_url = "https://dns.google/resolve?name=$short_hash.url-shortener.pumukydev.com&type=TXT";

// Realiza la solicitud al servicio de DNS de Google
$response = file_get_contents($dns_query_url);

// Verifica si la solicitud fue exitosa
if ($response === false) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error al consultar el servicio de DNS.";
    exit;
}

// Decodifica la respuesta JSON
$data = json_decode($response, true);

// Verifica si hay respuestas TXT en el campo `Answer`
if (!isset($data['Answer'])) {
    header("HTTP/1.1 404 Not Found");
    echo "URL no encontrada.";
    exit;
}

// Obtén el último registro TXT (la URL larga)
$txt_records = $data['Answer'];
$last_record = end($txt_records);
$long_url = $last_record['data'];

// Limpia las comillas del contenido TXT
$long_url = trim($long_url, '"');

// Redirige al usuario a la URL larga
header("Location: $long_url", true, 301);
exit;
?>

