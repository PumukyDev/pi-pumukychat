<?php
$pageTitle = "PumukyDev - URL Shortener";
include '../includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    # Receive the long URL from the form
    $long_url = $_POST['long_url'];

    # Generate the shortened hash
    $short_hash = substr(hash('sha256', $long_url), 0, 6);

    # Define the short URL
    $short_url = "pumukydev.com/$short_hash";

    # Run the "post_txt.sh" script to register the TXT record
    $script_path = realpath("post_txt.sh");
    $command = "bash $script_path $short_hash \"$long_url\"";
    exec($command, $output, $return_var);

    # Check the result of the command
    if ($return_var === 0) {
        # Display the generated short URL
        $message = "Your short URL is: <a href='https://$short_url' target='_blank'>$short_url</a>";
    } else {
        # Error while creating the TXT record
        $message = "There was a problem creating the short URL. Please try again.";
    }
}
?>

<main id="url-shortener">
    <h1>URL shortener</h1>
    <div>
        <form action="index.php" method="POST">
            <label for="long_url">URL to shorten:</label>
            <input type="url" id="long_url" name="long_url" required/>
            <button type="submit">Shorten</button>
        </form>

        <?php if (isset($message)) { ?>
            <div class="message"><?= $message; ?></div>
        <?php } ?>
    </div>
</main>

<?php include '../includes/footer.php'; ?>
