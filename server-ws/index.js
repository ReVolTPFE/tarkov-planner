const { Server } = require("socket.io");

const io = new Server(3001, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}
});

// Stockage temporaire en RAM (v0.1.0+)
// Structure : { "room-123": [ {shape1}, {shape2} ] }
const roomStates = {};

io.on("connection", (socket) => {
	console.log("Nouvelle connexion :", socket.id);

	socket.on("join-room", (roomId) => {
		socket.join(roomId);
		console.log(`Utilisateur ${socket.id} a rejoint la room: ${roomId}`);

		// Envoyer l'état actuel de la map au nouvel arrivant
		if (roomStates[roomId]) {
			socket.emit("init-state", roomStates[roomId]);
		}
	});

	socket.on("send-shape", ({ roomId, shape, mapSlug }) => {
		// 1. Sauvegarder dans la RAM du serveur
		if (!roomStates[roomId]) roomStates[roomId] = [];
		roomStates[roomId].push({ shape, mapSlug });

		// 2. Diffuser à tous les AUTRES dans la room
		socket.to(roomId).emit("new-shape", { shape, mapSlug });
	});

	socket.on("clear-canva", ({ roomId, mapSlug }) => {
		if (roomStates[roomId]) {
			// On ne garde que les dessins qui ne sont PAS sur cette map
			roomStates[roomId] = roomStates[roomId].filter(item => item.mapSlug !== mapSlug);

			console.log(`Map ${mapSlug} vidée dans la room ${roomId}`);

			// On diffuse l'info en précisant quelle map a été vidée
			socket.to(roomId).emit("canva-cleared", mapSlug);
		}
	});

	socket.on("disconnect", () => {
		console.log("Déconnexion :", socket.id);
	});
});

console.log("🚀 Serveur WebSocket lancé sur le port 3001");
