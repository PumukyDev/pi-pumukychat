<?php
$pageTitle = "PumukyDev - URL Shortener";
include '../includes/header.php';
?>

<main>
    <h1>Acortador de URL</h1>
    <p>Usa esta herramienta para acortar tus enlaces.</p>

    <form action="urlshortener.php" method="POST">
        <label for="long_url">URL larga:</label>
        <input type="text" id="long_url" name="long_url" required/>
        <br>
        <button type="submit">Acortar</button>
    </form>
</main>

<?php include '../includes/footer.php';?>