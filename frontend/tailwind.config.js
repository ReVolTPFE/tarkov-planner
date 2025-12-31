/** @type {import('tailwindcss').Config} */
export default {
	content: ["./app/**/*.{js,vue,ts}",],
	theme: {
		extend: {
			colors: {
				"primary": "#ff5e00",
				"gray": {
					"border": "#383838",
					"lighter": "#dbd9d7",
					"light": "#8a8580",
					"medium": "#2e2e2e",
					"dark": "#1a1a1a",
					"darker": "#141414",
				}
			}
		},
	},
	plugins: [],
};
