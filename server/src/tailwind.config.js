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
            colors: {
                pumukyChatTheme: {
                    sidebar: '#2B2D31',
                    hover: '#404249',
                    text: '#F2F3F5',
                    subtle: '#B5BAC1',
                },
            },
        },
        screens: {
            xs: "420px",
            sm: "640px", // <- cambiado de 680px a 640px para respetar el breakpoint estándar
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
                    primary: "#5865F2",
                    secondary: "#4F545C",
                    accent: "#3BA55D",
                    neutral: "#2C2F33",
                    "base-100": "#23272A",
                    "base-200": "#2C2F33",
                    "base-300": "#40444B",
                    "base-content": "#F2F3F5", // <- añadido para que el texto herede bien
                    info: "#00B0F4",
                    success: "#3BA55D",
                    warning: "#FAA61A",
                    error: "#ED4245",
                    bubbleown: "#5865F2", // Azul Discord
                    bubbleother: "#2F3136", // Gris oscuro
                    "bubbleown-content": "#F2F3F5",
                    "bubbleother-content": "#F2F3F5",
                },
            },
            {
                pumukyChatLight: {
                    primary: "#4F46E5",
                    secondary: "#6B7280",
                    accent: "#10B981",
                    neutral: "#F3F4F6",
                    "base-100": "#FFFFFF",
                    "base-200": "#F9FAFB",
                    "base-300": "#E5E7EB",
                    "base-content": "#1F2937", // <- añadido para texto oscuro coherente
                    info: "#3B82F6",
                    success: "#22C55E",
                    warning: "#EAB308",
                    error: "#EF4444",
                    bubbleown: "#E5E7EB", // Gris clarito
                    bubbleother: "#F3F4F6", // Fondo blanco roto
                    "bubbleown-content": "#1F2937",
                    "bubbleother-content": "#1F2937",
                },
            }
        ],
        darkTheme: "pumukyChatTheme",
    }
};
