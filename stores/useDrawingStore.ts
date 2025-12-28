import { defineStore } from "pinia";
import { $fetch } from "ofetch" ;
import { useMapStore } from "./useMapStore";

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
            {
                type: "undo",
                icon: "fa-solid fa-rotate-left",
            },
            // {
            //     type: "redo",
            //     icon: "fa-solid fa-rotate-right",
            // },
            {
                type: "trash",
                icon: "fa-solid fa-trash",
            },
            {
                type: "fullscreen",
                icon: "fa-solid fa-expand",
            },
        ],
        currentTool: "pointer" as string | null,
        isLoading: false,
        // Structure : { "customs": [{id: 1, points: []}], "reserve": [] }
        drawings: {} as Record<string, any[]>,
        isDrawing: false,
        activeShape: null as any | null, // La forme en cours de tracé
        currentColor: "#ff5e00",
    }),

    actions: {
        selectTool(type: string) {
            this.currentTool = type;
        },

        // Cette action sera utilisée par le Canva et par les WebSockets
        addShapeToMap(mapSlug: string, shape: any) {
            if (!this.drawings[mapSlug]) {
                this.drawings[mapSlug] = [];
            }
            this.drawings[mapSlug].push(shape);
        },

        clearCurrentMap() {
            const mapStore = useMapStore();
            const map = mapStore.getCurrentMap;

            if (map !== null) {
                this.drawings[map.slug] = [];
            }
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

            // On crée l'objet de base
            const newShape = {
                id: Date.now().toString(),
                type: this.currentTool,
                // Pour un crayon, on commence le tableau de points
                // Pour un carré, x-y sera le point d'origine
                points: [pos.x, pos.y],
                stroke: this.currentColor,
                strokeWidth: 3,
                draggable: false, // On pourra le rendre draggable plus tard pour le modifier
                lineCap: 'round',
                lineJoin: 'round',
                tension: 0.5,
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

                if (dist > 3) { // On n'ajoute un point que si on a bougé de plus de 3 pixels
                    this.activeShape.points.push(pos.x, pos.y);

                    // On force la réactivité en "réassignant" le tableau à lui-même
                    // C'est très rapide, car c'est juste une copie de référence, pas de données
                    this.activeShape.points = [...this.activeShape.points];
                }
            }

            else if (this.activeShape.type === 'square' || this.activeShape.type === 'arrow') {
                // Mode Forme géométrique :
                // On garde toujours les 2 premiers points (origine)
                // et on remplace les 2 derniers (destination)
                this.activeShape.points[2] = pos.x;
                this.activeShape.points[3] = pos.y;

                // On force la réactivité en "réassignant" le tableau à lui-même
                // C'est très rapide, car c'est juste une copie de référence, pas de données
                this.activeShape.points = [...this.activeShape.points];
            }
        },

        stopDrawing() {
            this.isDrawing = false;
            this.activeShape = null;
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
