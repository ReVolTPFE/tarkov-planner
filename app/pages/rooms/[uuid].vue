<script setup>
import MapsSidebar from '~/components/MapsSidebar.vue';
import { useRoomStore } from "../../../stores/useRoomStore.js";
import { useMapStore } from "../../../stores/useMapStore.js";
import Canva from "../../components/Canva.vue";

const route = useRoute();
const mapStore = useMapStore();
const roomStore = useRoomStore();

watch(() => route.params.uuid, (newUuid) => {
	roomStore.fetchRoom(newUuid);
}, { immediate: true });

onUnmounted(() => {
	mapStore.$reset();
	roomStore.$reset();
});
</script>

<template>
	<main class="grid grid-cols-12 h-[calc(100vh-64px)] overflow-hidden bg-gray-dark">
		<template v-if="roomStore.isLoading">
			<div class="col-span-12">
				<div class="flex justify-center items-center text-gray-lighter mt-16">
					Loading...
				</div>
			</div>
		</template>

		<template v-else>
			<template v-if="roomStore.currentRoom">
				<div class="col-span-2 h-full overflow-hidden">
					<MapsSidebar />
				</div>

				<div class="col-span-10 p-4">
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