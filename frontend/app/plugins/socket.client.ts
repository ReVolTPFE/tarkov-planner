import { io } from "socket.io-client";
import { useDrawingStore } from "../stores/useDrawingStore";

export default defineNuxtPlugin(() => {
	const runtimeConfig = useRuntimeConfig();
	const wsUrl: string = runtimeConfig.public.WS_URL as string;

	// Connexion au serveur de socket
	const socket = io(wsUrl, { autoConnect: false });

	const drawingStore = useDrawingStore();

	// --- ÉCOUTEURS (Recevoir du serveur) ---

	socket.on("connect", () => {
		console.log("Connecté au serveur WebSocket (ID:", socket.id, ")");
	});

	socket.on("init-state", (roomInfos: [{ shape:any, mapSlug: string }]) => {
		roomInfos.forEach(info => {
			// Sécurité : on vérifie que l'objet et la forme existent
			if (info && info.shape && info.mapSlug) {

				// On vérifie aussi que la forme a bien un ID
				if (info.shape.id) {
					drawingStore.addShapeToMap(info.mapSlug, info.shape);
				} else {
					console.warn("Forme reçue sans ID lors de l'init-state", info);
				}
			}
		});
	});

	// Quand un autre utilisateur dessine une forme
	socket.on("new-shape", (data: { shape: any, mapSlug: string }) => {
		drawingStore.addShapeToMap(data.mapSlug, data.shape);
	});

	socket.on("delete-shape", (data: { shapeId: string, mapSlug: string }) => {
		drawingStore.removeShape(data.mapSlug, data.shapeId);
	});

	// Quand la map est vidée par quelqu'un d'autre
	socket.on("canva-cleared", (mapSlug) => {
		drawingStore.clearMap(mapSlug);
	});

	// --- PROVIDE ---
	// Permet d'utiliser $socket dans tes composants via useNuxtApp()
	return {
		provide: {
			socket: socket
		}
	};
});
