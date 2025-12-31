// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: process.env.NODE_ENV === 'development' },
	future: {
		compatibilityVersion: 4,
	},

	vite: {
		server: {
			watch: process.env.NODE_ENV === 'development' ? {
				usePolling: true,
				interval: 1000,
			} : null,
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
	},
	runtimeConfig: {
		public: {
			API_URL: process.env.NUXT_PUBLIC_API_URL,
			WS_URL: process.env.NUXT_PUBLIC_WS_URL,
		}
	},
});
