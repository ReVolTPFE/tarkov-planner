<script setup>
import Canva from "../../components/Canva.vue";
import { useRoomStore } from "../../../stores/useRoomStore.js";
import { useMapStore } from "../../../stores/useMapStore.js";
import { useDrawingStore } from "../../../stores/useDrawingStore.js";

const route = useRoute();
const mapStore = useMapStore();
const roomStore = useRoomStore();
const drawingStore = useDrawingStore();

watch(() => route.params.uuid, (newUuid) => {
	roomStore.fetchRoom(newUuid);
}, { immediate: true });

onMounted(() => {
	mapStore.fetchMaps();
});

onUnmounted(() => {
	mapStore.$reset();
	roomStore.$reset();
	drawingStore.$reset();
});
</script>

<template>
	<main class="h-[calc(100vh-64px)] bg-gray-dark">
		<template v-if="roomStore.isLoading">
			<div class="col-span-12">
				<div class="flex justify-center items-center text-gray-lighter mt-16">
					Loading...
				</div>
			</div>
		</template>

		<template v-else>
			<template v-if="roomStore.currentRoom">
				<div class="w-full h-full p-4">
					<Canva />
				</div>
			</template>

			<template v-else>
				<div class="col-span-12">
					<div class="flex justify-center items-center text-gray-lighter mt-16">
						Error fetching this room : <NuxtLink to="/" class="mx-4 text-gray-lighter border border-gray-medium p-2 rounded">Back to home</NuxtLink>
					</div>
				</div>
			</template>
		</template>
	</main>
</template>
