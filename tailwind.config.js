/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#050505',
                panel: '#0f0f15',
                primary: '#00ccff',
                secondary: '#cc33ff',
                success: '#33ff99',
                warning: '#ffcc00',
                danger: '#ff3333',
            },
            fontFamily: {
                main: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
                mono: ['Courier New', 'Courier', 'monospace'],
            },
        },
    },
    plugins: [],
}
