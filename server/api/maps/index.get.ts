export default defineEventHandler(async (event) => {
	try {
		const maps = await prisma.map.findMany();

		return maps;
	} catch (error: any) {
		console.error("Erreur API Maps:", error);

		throw createError({
			statusCode: 500,
			statusMessage: "Erreur lors de la récupération des cartes",
			data: error.message
		});
	}
});
