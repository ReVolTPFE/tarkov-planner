import { defineStore } from "pinia";
import { useMapStore } from "./useMapStore";

const REFERENCE_WIDTH = 5000;
export const STROKE_SIZES = {
    1: 10,
    2: 20,
    3: 30,
};
const DEFAULT_SIZE_INDEX = 2;
export const COLORS = [
    "#ffffff",
    "#000000",
    "#0077ff",
    "#e60707",
];

export const useDrawingStore = defineStore("drawing", {
    state: () => ({
        tools: [
            {
                type: "pointer",
                icon: "fa-solid fa-arrow-pointer",
            },
            {
                type: "pen",
                icon: "fa-solid fa-pen",
            },
            {
                type: "arrow",
                icon: "fa-solid fa-arrow-right-long",
            },
            {
                type: "square",
                icon: "fa-regular fa-square",
            },
            {
                type: "circle",
                icon: "fa-regular fa-circle",
            },
            // {
            //     type: "undo",
            //     icon: "fa-solid fa-rotate-left",
            // },
            // {
            //     type: "redo",
            //     icon: "fa-solid fa-rotate-right",
            // },
            {
                type: "eraser",
                icon: "fa-solid fa-eraser",
            },
            // {
            //     type: "trash",
            //     icon: "fa-solid fa-trash",
            // },
            {
                type: "fullscreen",
                icon: "fa-solid fa-expand",
            },
        ],
        currentTool: "pointer" as string,
        isLoading: false,
        // Structure : { "customs": [{id: 1, points: []}], "reserve": [] }
        drawings: {} as Record<string, any[]>,
        isDrawing: false,
        activeShape: null as any | null, // La forme en cours de tracé
        currentColor: COLORS[0],
        currentStrokeWidth: STROKE_SIZES[DEFAULT_SIZE_INDEX],
        currentStrokeWidthTool: DEFAULT_SIZE_INDEX
    }),

    actions: {
        selectTool(type: string) {
            this.currentTool = type;
        },

        selectStrokeWidthSize(number: number) {
            if (number in STROKE_SIZES) {
                this.currentStrokeWidth = STROKE_SIZES[number as keyof typeof STROKE_SIZES];
                this.currentStrokeWidthTool = number;
            }
        },

        // Cette action sera utilisée par le Canva et par les WebSockets
        addShapeToMap(mapSlug: string, shape: any) {
            if (!this.drawings[mapSlug]) {
                this.drawings[mapSlug] = [];
            }
            this.drawings[mapSlug].push(shape);
        },

        clearMap(mapSlug: string, localOnly = true) {
            if (!localOnly) {
                const { $socket } = useNuxtApp();
                const route = useRoute();
                $socket.emit("clear-canva", { roomId: route.params.uuid, mapSlug: mapSlug });
            }

            this.drawings[mapSlug] = [];
        },

        undoOnCurrentMap() {
            const mapStore = useMapStore();
            const map = mapStore.getCurrentMap;

            if (map !== null && this.drawings[map.slug]) {
                this.drawings[map.slug]?.pop();
            }
        },

        startShape(pos: { x: number, y: number }) {
            const mapStore = useMapStore();
            const mapSlug = mapStore.getCurrentMap?.slug;
            if (!mapSlug || this.currentTool === 'pointer') return;

            this.isDrawing = true;
            const isGeometrical = ['arrow', 'square', 'circle'].includes(this.currentTool);

            // --- LOGIQUE DU RATIO ---
            // On calcule le multiplicateur basé sur la largeur réelle de l'image chargée
            const ratio = (mapStore.currentMapWidth) / REFERENCE_WIDTH;
            const adjustedStrokeWidth = this.currentStrokeWidth * ratio;

            // On crée l'objet de base
            const newShape = {
                id: Date.now().toString(),
                type: this.currentTool,
                // Si c'est une forme géométrique, on initialise [x1, y1, x2, y2]
                points: isGeometrical ? [pos.x, pos.y, pos.x, pos.y] : [pos.x, pos.y],
                stroke: this.currentColor,
                strokeWidth: adjustedStrokeWidth,
                draggable: false, // On pourra le rendre draggable plus tard pour le modifier
                lineCap: 'round',
                lineJoin: 'round',
                tension: this.currentTool === 'pen' ? 0.5 : 0, // Pas de tension pour les flèches/carrés/cercles
                ...(this.currentTool === 'arrow' && {
                    fill: this.currentColor,
                    pointerLength: adjustedStrokeWidth * 2,
                    pointerWidth: adjustedStrokeWidth * 2
                }),
            };

            // On l'ajoute au tableau de la map
            this.addShapeToMap(mapSlug, newShape);

            // On garde une référence DIRECTE pour la modifier sans chercher dans le tableau
            this.activeShape = newShape;
        },

        updateShape(pos: { x: number, y: number }) {
            if (!this.isDrawing || !this.activeShape) return;

            if (this.activeShape.type === 'pen') {
                // Mode Crayon : on ajoute les points les uns après les autres avec une sécurité de refresh
                const points = this.activeShape.points;
                const lastX = points[points.length - 2];
                const lastY = points[points.length - 1];

                // Calcul de la distance entre le dernier point et la souris
                const dist = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2));

                if (dist > 5) { // On n'ajoute un point que si on a bougé de plus de 3 pixels
                    this.activeShape.points.push(pos.x, pos.y);

                    // On force la réactivité en "réassignant" le tableau à lui-même
                    // C'est très rapide, car c'est juste une copie de référence, pas de données
                    this.activeShape.points = [...this.activeShape.points];
                }
            }

            else if (this.activeShape.type === 'arrow' || this.activeShape.type === 'square') {
                // On crée une copie propre du tableau de points
                const newPoints = [...this.activeShape.points];

                // newPoints[0] et [1] sont le clic initial
                // newPoints[2] et [3] deviennent la position actuelle de la souris
                newPoints[2] = pos.x;
                newPoints[3] = pos.y;

                // On réassigne le tableau entier pour déclencher la réactivité
                this.activeShape.points = newPoints;
            }

            // Cercle par son centre
            // else if (this.activeShape.type === 'circle') {
            //     const x1 = this.activeShape.points[0];
            //     const y1 = this.activeShape.points[1];
            //     // Calcul de la distance entre le centre et la souris
            //     const radius = Math.sqrt(Math.pow(pos.x - x1, 2) + Math.pow(pos.y - y1, 2));
            //     this.activeShape.radius = radius;
            // }

            // Cercle par top/left => Mais c'est plutot une ellipse maintenant
            else if (this.activeShape.type === 'circle') {
                const x1 = this.activeShape.points[0];
                const y1 = this.activeShape.points[1];
                const x2 = pos.x;
                const y2 = pos.y;

                // Le centre est toujours le milieu du segment [Clic initial -> Souris]
                this.activeShape.centerX = (x1 + x2) / 2;
                this.activeShape.centerY = (y1 + y2) / 2;

                // Rayons calculés (distance au centre)
                this.activeShape.radiusX = Math.abs(x2 - x1) / 2;
                this.activeShape.radiusY = Math.abs(y2 - y1) / 2;
            }
        },

        removeShape(mapSlug: string, shapeId: string, localOnly = true) {
            if (!this.drawings[mapSlug]) return;

            this.drawings[mapSlug] = this.drawings[mapSlug].filter(s => s.id !== shapeId);

            if (!localOnly) {
                const { $socket } = useNuxtApp();
                const route = useRoute();

                $socket.emit("delete-shape", {
                    roomId: route.params.uuid,
                    mapSlug: mapSlug,
                    shapeId: shapeId
                });
            }
        },

        stopDrawing() {
            if (!this.isDrawing || !this.activeShape) return;

            // 1. On récupère les infos nécessaires
            const mapStore = useMapStore();
            const { $socket } = useNuxtApp();
            const route = useRoute();

            // 2. On prépare le paquet de données
            const payload = {
                roomId: route.params.uuid,
                mapSlug: mapStore.getCurrentMap?.slug,
                shape: this.activeShape
            };

            // 3. On envoie au serveur
            $socket.emit("send-shape", payload);

            this.isDrawing = false;
            this.activeShape = null;
        },

        toggleFullscreenMode() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        },
    },

    getters: {
        getCurrentTool: (state) => {
            return state.tools.find((t) => t.type === state.currentTool) || null;
        },

        // Ce getter est crucial : le Canva ne lira que ça
        activeMapShapes(state) {
            const mapStore = useMapStore();
            const mapSlug = mapStore.getCurrentMap?.slug;
            return mapSlug ? (state.drawings[mapSlug] || []) : [];
        }
    },
});
