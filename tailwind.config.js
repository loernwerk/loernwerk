import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./frontend/index.html', './frontend/src/**/*.{js,ts,vue}'],
    theme: {
        extend: {
            colors: {
                font: '#000000',
                backgorund: 'hsl(0, 0%, 97%)',
                container: {
                    DEFAULT: 'hsl(0, 0%, 98%)',
                    border: 'hsl(0, 0%, 80%)',
                },
                interactable: {
                    DEFAULT: 'hsl(0, 0%, 100%)',
                    border: 'hsl(0, 0%, 75%)',
                },
                scrollbar: {
                    backgorund: colors.slate[100],
                    thumb: colors.slate[400],
                },
                accent: {
                    DEFAULT: '#be1622',
                    dark: '#7F0F18',
                },
                navbar: {
                    DEFAULT: '#006634'
                }
            },
            borderWidth: {
                1: '1px',
            },
        },
    },
    plugins: [],
};
