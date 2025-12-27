import { defineStore } from "pinia";

export const useRoomStore = defineStore("room", {
    state: () => ({
        currentRoom: null as any | null,
        isLoading: false,
    }),

    actions: {
        async createRoom() {
            this.isLoading = true;
            try {
                this.currentRoom = await $fetch("/api/rooms", {
                    method: "POST",
                });

                return this.currentRoom;
            } catch (error) {
                console.error("Erreur création Room :", error);
                this.currentRoom = null;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchRoom(roomUuid: string) {
            this.isLoading = true;
            try {
                this.currentRoom = await $fetch(`/api/rooms/${roomUuid}`);
            } catch (error) {
                console.error("Erreur lors du chargement de la room :", error);
                this.currentRoom = null;
            } finally {
                this.isLoading = false;
            }
        },
    },
});
