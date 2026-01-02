import { defineStore } from "pinia";
import { $api } from "../utils/api";

export const useMapStore = defineStore("map", {
    state: () => ({
        maps: [] as any[],
        currentMapId: "1" as string | null,
        isLoading: false,
        currentMapWidth: 0,
        currentMapHeight: 0,
    }),

    actions: {
        async fetchMaps() {
            this.isLoading = true;
            try {
                const data = await $api("/maps");
                this.maps = data as any[];
            } catch (error) {
                console.error("Erreur lors du chargement des cartes :", error);
            } finally {
                this.isLoading = false;
            }
        },

        selectMap(id: string) {
            this.currentMapId = id;
        },

        setMapDimensions(width: number, height: number) {
            this.currentMapWidth = width;
            this.currentMapHeight = height;
        },
    },

    getters: {
        getCurrentMap: (state) => {
            return state.maps.find((m) => m.id === state.currentMapId) || null;
        },

        getMapBySlug: (state) => {
            return (slug: string) => state.maps.find((m) => m.slug === slug) || null;
        }
    },
});
