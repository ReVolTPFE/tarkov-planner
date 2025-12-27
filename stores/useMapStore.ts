import { defineStore } from "pinia";
import { $fetch } from "ofetch" ;

export const useMapStore = defineStore("map", {
    state: () => ({
        maps: [] as any[],
        currentMapId: null as string | null,
        isLoading: false,
    }),

    actions: {
        async fetchMaps() {
            this.isLoading = true;
            try {
                const data = await $fetch("/api/maps");
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
    },

    getters: {
        getCurrentMap: (state) => {
            return state.maps.find((m) => m.id === state.currentMapId) || null;
        },
    },
});
