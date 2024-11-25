<?php
$pageTitle = "Error404";
include '../includes/header.php';
?>

<main>
    <h1>Error404</h1>
    <p>Page not found!</p>
</main>

<?php
// Obtener el esquema (http o https)
$scheme = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";

// Obtener el host (por ejemplo, pumukydev.com)
$host = $_SERVER['HTTP_HOST'];

// Obtener la ruta (por ejemplo, /2feb9a)
$uri = $_SERVER['REQUEST_URI'];

// Construir la URL completa
$url = $scheme . "://" . $host . $uri;

echo "La URL actual es: " . $url;

$short_hash = basename($uri);

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


<?php include '../includes/footer.php';?>

