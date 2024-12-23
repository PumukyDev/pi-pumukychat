<?php
function redirect($url) {
    $content = sprintf('<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="refresh" content="1;url=%1$s" />
  
      <title>Redirecting to %1$s</title>
    </head>
    <body>
      Redirecting to <a href="%1$s">%1$s</a>.
    </body>
    </html>', htmlspecialchars($url, ENT_QUOTES, 'UTF-8'));
    header('Location: ' . $url);
    die($content);
  }
// Get the scheme (http or https)
$scheme = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";

// Get the host (e.g., pumukydev.com)
$host = $_SERVER['HTTP_HOST'];

// Get the URI (e.g., /2feb9a)
$uri = $_SERVER['REQUEST_URI'];

// Build the full URL
$url = $scheme . "://" . $host . $uri;

$short_hash = basename($uri);

// Build the Google service URL to query the TXT record
$dns_query_url = "https://dns.google/resolve?name=$short_hash.url-shortener.pumukydev.com&type=TXT";

// Make the request to Google's DNS service using file_get_contents
$response = file_get_contents($dns_query_url);

// Check if the request was successful
if ($response === false) {
    header("HTTP/1.1 500 Internal Server Error");
    exit;
}

// Decode the JSON response
$data = json_decode($response, true);

// Check if there are TXT answers in the `Answer` field
if (!isset($data['Answer'])) {
    header("HTTP/1.1 404 Not Found");
    exit;
}

// Get the last TXT record (the long URL)
$txt_records = $data['Answer'];
$last_record = end($txt_records);
$long_url = $last_record['data'];

// Remove quotes from the TXT content
$long_url = trim($long_url, '"');

// Redirect the user to the long URL
redirect($long_url);
//header("Location: $long_url", true, 301);

$pageTitle = "Error404";
include '../includes/header.php';
?>

<main>
    <h1>Error404</h1>
    <p>Page not found!</p>
</main>


<?php include '../includes/footer.php';?>
