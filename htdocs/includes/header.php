shortener.php<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Usamos una variable PHP para el título -->
    <title><?php echo isset($pageTitle) ? $pageTitle : 'PumukyDev - Página de Bienvenida'; ?></title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="header-container">
            <a href="index.php" class="logo">PumukyDev</a>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.php">Home</a></li>
                    <li><a href="shortener.php">URL Shortener</a></li>
                    <li><a href="tools.php">Tools</a></li>
                </ul>
            </nav>
            <div class="lang-switch">
                <a href="?lang=es">ES</a> | 
                <a href="?lang=en">EN</a>
            </div>
        </div>
    </header>
