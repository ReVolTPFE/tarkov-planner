// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},

	vite: {
		server: {
			watch: {
				usePolling: true,
				interval: 1000,
			},
		},
	},

	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
	app: {
		head: {
			script: [
				{
					src: 'https://kit.fontawesome.com/8ba44779d9.js',
					defer: true,
					type: 'text/javascript',
					crossorigin: "anonymous",
				}
			],
		}
	}
});
