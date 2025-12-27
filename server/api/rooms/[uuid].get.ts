export default defineEventHandler(async (event) => {
	const uuid = getRouterParam(event, "uuid");

	if (!uuid) {
		throw createError({
			statusCode: 400,
			statusMessage: "UUID de la Room manquant",
		});
	}

	try {
		const room = await prisma.room.findUnique({
			where: {
				uuid: uuid,
			},
			// include: {
			// 	map: true,      // Jointure pour avoir les infos de la carte (image, slug)
			// 	drawings: true, // Pour récupérer les tracés déjà existants
			// },
		});

		if (!room) {
			throw createError({
				statusCode: 404,
				statusMessage: "Room non trouvée",
			});
		}

		return room;
	} catch (error: any) {
		throw createError({
			statusCode: 500,
			statusMessage: error.message || "Erreur serveur lors de la récupération",
		});
	}
});
