<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'PumukyDev'; ?></title>
    <link rel="icon" type="image/x-icon" href="<?php echo isset($pathFavicon) ? $pathFavicon : '../images/favicon.png'; ?>">
    <link rel="stylesheet" href="<?php echo isset($pathStyle) ? $pathStyle : '../style/style.css'; ?>">
</head>
<body>
    <header>
        <div class="header-container">
            <a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>" class="logo">PumukyDev</a>
            <nav>
                <ul class="nav-links">
                    <li><a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>">Home</a></li>
                    <li><a href="<?php echo isset($pathShortener) ? $pathShortener : '../shortener'; ?>">URL Shortener</a></li>
                    <li><a href="<?php echo isset($pathTools) ? $pathTools : '../tools'; ?>">Tools</a></li>
                </ul>
            </nav>
            <div class="lang-switch">
                <a href="?lang=es">ES</a> | 
                <a href="?lang=en">EN</a>
            </div>
        </div>
    </header>
