import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // Tailwind utility classes for custom pumukyChatTheme-style colors
            colors: {
                pumukyChatTheme: {
                    sidebar: '#2B2D31',     // Sidebar / nav background
                    hover: '#404249',       // Hover background
                    text: '#F2F3F5',         // Main readable text
                    subtle: '#B5BAC1',       // Secondary text / metadata
                },
            },
        },
        screens: {
            xs: "420px",
            sm: "680px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [forms, require('daisyui')],
    daisyui: {
        themes: [
            {
                pumukyChatTheme: {
                    "primary": "#5865F2",
                    "secondary": "#4F545C",
                    "accent": "#3BA55D",
                    "neutral": "#2C2F33",
                    "base-100": "#23272A",
                    "base-200": "#2C2F33",
                    "base-300": "#40444B",
                    "info": "#00B0F4",
                    "success": "#3BA55D",
                    "warning": "#FAA61A",
                    "error": "#ED4245",
                },
            },
        ],
        darkTheme: "pumukyChatTheme",
    },
};
