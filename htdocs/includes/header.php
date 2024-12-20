<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'PumukyDev'; ?></title>
    <link rel="icon" type="image/x-icon" href="<?php echo isset($pathFavicon) ? $pathFavicon : '../images/favicon.png'; ?>">

    <?php

    #Le pongo nombre a la cookie
    $theme_cookie = "theme";

    # If the user click on a theme svg, create or renew the cookie
    if (isset($_POST["theme"])) {
        $theme = $_POST['theme'];
        setcookie("$theme_cookie", "$theme", time() + 86400 * 7, "/");
    }
    # If the user do not click on the svg, pick the user cookie (if he have one)
    else {
        $theme = $_COOKIE["$theme_cookie"];
    }

    # If the cookie is dark, save the path of the dark css
    if ($theme === "dark") {
        $themePath = (isset($pathDarkTheme) ? $pathDarkTheme : '../style/dark.css');
    } 
    # If not, save the path of the light css
    else {
        $themePath = (isset($pathLightTheme) ? $pathLightTheme : '../style/light.css');
    }
    ?>

    <!-- Select light or dark css theme-->
    <link rel="stylesheet" href="<?php echo $themePath; ?>">

</head>

<body>
    <header>
        <div class="header-container">
            <a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>" class="logo">PumukyDev</a>
            <nav>
                <ul class="nav-links">
                    <li><a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>">Home</a></li>
                    <li><a href="<?php echo isset($pathShortener) ? $pathShortener : '../shortener'; ?>">URL Shortener</a></li>
                    <li><a href="<?php echo isset($pathTools) ? $pathTools : '../tools'; ?>">Contact</a></li>
                </ul>
            </nav>
            <form action="" method="post">

                <button type="submit" name="theme" value="light">
                    <svg id="sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>

                <button type="submit" name="theme" value="dark">
                    <svg id="moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
            </form>
            <div class="lang-switch">
                <a href="?lang=es">ES</a> |
                <a href="?lang=es">EN</a>
            </div>
            <div class="lang-switch">
                <a href="?lang=es">Sign up</a> |
                <a href="?lang=es">Login</a>
            </div>
        </div>
    </header>