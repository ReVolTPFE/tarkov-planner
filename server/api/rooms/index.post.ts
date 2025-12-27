export default defineEventHandler(async (event) => {
	try {
		const newRoom = await prisma.room.create({});

		return newRoom;
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: "Impossible de créer la Room",
		});
	}
});
