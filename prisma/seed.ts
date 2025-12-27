import { prisma } from "../app/server/utils/db";

async function main() {
	const maps = [
		{ slug: "customs", image: "customs.jpg" },
        { slug: "factory", image: "factory.webp" },
        { slug: "ground-zero", image: "ground-zero.webp" },
        { slug: "interchange", image: "interchange.jpg" },
        { slug: "lighthouse", image: "lighthouse.webp" },
        { slug: "reserve", image: "reserve.jpg" },
        { slug: "shoreline", image: "shoreline.jpg" },
        { slug: "streets-of-tarkov", image: "streets-of-tarkov.jpg" },
        { slug: "the-lab", image: "the-lab.webp" },
        { slug: "the-labyrinth", image: "the-labyrinth.png" },
        { slug: "woods", image: "woods.jpg" }
	];

	for (const map of maps) {
		await prisma.map.upsert({
			where: { slug: map.slug },
			update: {
				image: map.image
			},
			create: {
				slug: map.slug,
				image: map.image
			}
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
