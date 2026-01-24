/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": {
                    DEFAULT: "#137fec",
                    light: "#3a96ff",
                    dark: "#0b5db5",
                },
                "background": {
                    light: "#f6f7f8",
                    dark: "#0a0f14",
                },
                "surface": {
                    light: "#ffffff",
                    dark: "#141b22",
                    accent: "#1c232b",
                },
                "accent": {
                    cyan: "#00f5ff",
                    blue: "#3b82f6",
                    violet: "#a855f7",
                    emerald: "#10b981",
                    red: "#ef4444",
                    electric: "#7e22ce"
                },
                "brand": {
                    alliance: "#137fec",
                    void: "#8b5cf6",
                    neon: "#00f5ff"
                },
                "text": {
                    primary: "#f8fafc",
                    secondary: "#94a3b8",
                    muted: "#64748b",
                }
            },
            fontFamily: {
                "display": ["Outfit", "Inter", "sans-serif"],
                "body": ["Inter", "sans-serif"],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { opacity: '0.5', filter: 'blur(40px)' },
                    '100%': { opacity: '1', filter: 'blur(60px)' },
                }
            },
            backgroundImage: {
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
            },
        },
    },
    plugins: [],
}
