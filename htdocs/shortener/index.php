<?php
$pageTitle = "PumukyDev - URL Shortener";
include '../includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibe la URL larga desde el formulario
    $long_url = $_POST['long_url'];

    // Genera el hash acortado
    $short_hash = substr(hash('sha256', $long_url), 0, 6);

    // Define la URL corta
    $short_url = "$short_hash.url-shortener.pumukydev.com";

    // Ejecuta el script `post_txt.sh` para registrar el TXT record
    $script_path = realpath("post_txt.sh"); // Ruta al script
    $command = "bash $script_path $short_hash \"$long_url\""; // Construcción del comando
    exec($command, $output, $return_var);

    // Verifica el resultado del comando
    if ($return_var === 0) {
        // Muestra la URL corta generada
        $message = "¡Tu URL corta es: <a href='https://$short_url' target='_blank'>$short_url</a>";
    } else {
        // Error al crear el registro TXT
        $message = "Hubo un error al crear la URL corta. Por favor, inténtalo de nuevo.";
    }
}
?>

<main>
    <h1>Acortador de URL</h1>
    <p>Usa esta herramienta para acortar tus enlaces.</p>

    <form action="index.php" method="POST">
        <label for="long_url">URL larga:</label>
        <input type="text" id="long_url" name="long_url" required/>
        <br>
        <button type="submit">Acortar</button>
    </form>

    <?php if (isset($message)) { ?>
        <div class="message"><?= $message; ?></div>
    <?php } ?>
</main>

<?php include '../includes/footer.php'; ?>
