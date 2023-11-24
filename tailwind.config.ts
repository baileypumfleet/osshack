import type {Config} from 'tailwindcss'

export default {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'orange': {
                    DEFAULT: '#FF4D3C',
                    50: '#FFF5F4',
                    100: '#FFE2DF',
                    200: '#FFBDB6',
                    300: '#FF978E',
                    400: '#FF7265',
                    500: '#FF4D3C',
                    600: '#FF1A04',
                    700: '#CB1200',
                    800: '#930D00',
                    900: '#5B0800',
                    950: '#3F0500'
                },
            },
            fontFamily: {
                cal: ['Cal Sans', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require('@tailwindcss/typography')
    ],
} satisfies Config

