import { defineConfig } from '@prisma/config';

export default defineConfig({
	datasource: {
		// C'est ici qu'on définit l'URL pour les migrations (npx prisma migrate)
		url: process.env.DATABASE_URL,
	},
});
