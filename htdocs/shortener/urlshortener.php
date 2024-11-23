<?php
$pageTitle = "PumukyDev - URL Shortener";
include '../includes/header.php';
?>

<main>

<p><?php echo hash('ripemd160', '$_POST["long_url"]')?></p>

<?php include '../includes/footer.php';?>