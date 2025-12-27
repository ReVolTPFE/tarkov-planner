<script setup>
import MapsSidebar from '~/components/MapsSidebar.vue';
import { useRoomStore } from "../../../stores/useRoomStore.js";

const route = useRoute();
const roomStore = useRoomStore();

watch(() => route.params.uuid, (newUuid) => {
	roomStore.fetchRoom(newUuid);
}, { immediate: true });
</script>

<template>
	<main class="grid grid-cols-12 h-[calc(100vh-64px)] overflow-hidden" v-if="roomStore.currentRoom">
		<div class="col-span-2 h-full overflow-hidden">
			<MapsSidebar />
		</div>

		<div class="col-span-10 bg-gray-dark"></div>
	</main>

	<div v-else>Error fetching this room : <NuxtLink class="bg-red-500 p-2 rounded" to="/">Back to home</NuxtLink></div>
</template>