<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'PumukyDev'; ?></title>
    <link rel="icon" type="image/x-icon" href="<?php echo isset($pathFavicon) ? $pathFavicon : '../images/favicon.png'; ?>">

    <?php

    # Set the theme cookie
    $theme_cookie = "theme";

    # If the user click on a theme svg, create or renew the cookie
    if (isset($_POST["theme"])) {
        $theme = $_POST['theme'];
        setcookie('theme', $theme, [
            'expires' => time() + 3600 * 24 * 30,  # 30 days
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'None',
        ]);

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

    <!-- Remove default html style to make page to look the same in different browsers -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/taks-custom-base-css/taks-custom-base.css">

    <!-- Load "Inter" font-family -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

    <!-- Select main css theme-->
    <link rel="stylesheet" href="<?php echo isset($pathMainCss) ? $pathMainCss : '../style/main.css'; ?>">

    <!-- Select light or dark css theme-->
    <link rel="stylesheet" href="<?php echo $themePath; ?>">

</head>

<body>
    <canvas id="particleCanvas"></canvas>
    <header>
        <div class="header-container">
            <a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>" class="logo">PUMUKYDEV</a>
            <nav>
                <ul class="nav-links">
                    <li><a href="<?php echo isset($pathIndex) ? $pathIndex : '../'; ?>">Home</a></li>
                    <li><a href="<?php echo isset($pathShortener) ? $pathShortener : '../shortener'; ?>">URL Shortener</a></li>
                </ul>
            </nav>

            <div>
                <div id="github">
                    <a href="https://github.com/PumukyDev" target="_blank">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" class="block size-full" data-icon="github">
                            <symbol id="ai:local:github">
                                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                    <path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568"></path>
                                    <path d="M10 22v-3.242c0-.598.184-1.118.48-1.588.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2.166-.236.25-.354.27-.46.02-.108-.015-.247-.085-.527-.283-1.136-.264-2.343.16-3.43 0 0 .877-.287 2.874.96.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169.2-.032.428-.175.884-.46 1.997-1.247 2.874-.96 2.874-.96.424 1.087.443 2.294.16 3.43-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2 0 4.462-2.134 5.807-5.177 6.643-.367.101-.507.559-.303.88.296.47.48.99.48 1.589V22"></path>
                                </g>
                            </symbol>
                            <use xlink:href="#ai:local:github"></use>
                        </svg>
                    </a>
                </div>

                <form action="" method="post">

                    <!-- Sun (only visible in light mode) -->
                    <button type="submit" name="theme" value="light" id="sun">
                        <svg id="sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
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

                    <!-- Moon (only visible in dark mode) -->
                    <button type="submit" name="theme" value="dark" id="moon">
                        <svg id="moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </header>