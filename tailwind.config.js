export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {},
        container: {
            center: true,
            padding: '1rem',
            screens: {
                sm: '100%',
                md: '728px',
                lg: '1024px',
                xl: '1200px',
                '2xl': '1400px',
            },
        },

    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography')
    ],
}