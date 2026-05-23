import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: "#3b82f6", // Blue as primary color
              },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            screens: {
                xxs: "375px",
                xs: "425px",
                sm: "576px",
                md: "769px",
                lg: "992px",
                xl: "1200px",
                "2xl": "1400px",
                "3xl": "1900px",
              },
        },
    },

    plugins: [forms],
};
