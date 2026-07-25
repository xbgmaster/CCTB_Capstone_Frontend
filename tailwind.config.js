/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				brand: {
					50: "#f7fee7",
					100: "#ecfccb",
					200: "#d9f99d",
					300: "#bef264",
					400: "#a3e635",
					500: "#84cc16",
					600: "#65a30d",
					700: "#4d7c0f",
					800: "#3f6212",
					900: "#365314",
				},
				ink: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#94a3b8", // Ajustado para que brille más en el fondo azul
					600: "#cbd5e1",
					700: "#334155",
					800: "#1e293b",
					900: "#9fb7f0",
				},
			},
			fontFamily: {
				sans: [
					"Inter",
					"system-ui",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"sans-serif",
				],
			},
			boxShadow: {
				card: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)",
				cardHover:
					"0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)",
			},
			animation: {
				"fade-in": "fadeIn 0.2s ease-in-out",
				"slide-up": "slideUp 0.25s ease-out",
				"pulse-soft": "pulseSoft 2s ease-in-out infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				pulseSoft: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.6" },
				},
			},
		},
	},
	plugins: [],
};
