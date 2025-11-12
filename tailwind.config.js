/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff5f7',
                    100: '#ffe4e9',
                    200: '#ffccd8',
                    300: '#ffadc2',
                    400: '#ff8ba7',
                    500: '#ff6b8f',
                    600: '#ff4d7a',
                    700: '#f03866',
                    800: '#d62855',
                    900: '#b01d46',
                },
                orange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                peach: {
                    50: '#fff5f0',
                    100: '#ffe9dd',
                    200: '#ffd1bb',
                    300: '#ffb088',
                    400: '#ff8d5a',
                    500: '#ff6f2c',
                    600: '#ff5714',
                    700: '#e04006',
                    800: '#b93609',
                    900: '#942f0c',
                }
            }
        },
    },
    plugins: [],
}
