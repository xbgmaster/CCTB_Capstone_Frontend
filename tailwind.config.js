/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			colors: {
				// Primary brand: blue scale (bright blue -> deep navy) from the palette.
				brand: {
					50: "#eef4ff",
					100: "#d9e6fe",
					200: "#bacefd",
					300: "#8faefb",
					400: "#6b8ef2",
					500: "#4c7ae6",
					600: "#2f5fd0",
					700: "#1d3faa",
					800: "#14297a",
					900: "#0a1f5e",
				},
				// Deep navy used for hero backgrounds / gradients.
				navy: {
					50: "#e7ecf7",
					100: "#c3cfe9",
					200: "#8ea3cf",
					300: "#5a77b6",
					400: "#2f4e94",
					500: "#154593",
					600: "#0f337a",
					700: "#0b2660",
					800: "#091a3e",
					900: "#050f26",
				},
				// Neutral grays (black -> off white) from the palette.
				ink: {
					50: "#f4f5f7",
					100: "#e6e8ec",
					200: "#d3d6dc",
					300: "#aab0bb",
					400: "#7c828f",
					500: "#565c68",
					600: "#3f434d",
					700: "#2b2f37",
					800: "#191c22",
					900: "#0c0e13",
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
