<script setup>
import { useMapStore } from "../../stores/useMapStore.js";

const mapStore = useMapStore();
const emit = defineEmits(["close"])

function onClick(mapId) {
	mapStore.selectMap(mapId);
	emit("close");
}
</script>

<template>
	<nav v-if="mapStore.maps.length" class="bg-gray-darker border-b border-b-gray-border flex justify-center flex-wrap gap-4 p-4">
		<div v-for="map in mapStore.maps"
			 :key="map.id"
			 @click="onClick(map.id)"
			 class="bg-gray-dark border-2 border-gray-border rounded cursor-pointer"
			 :class="{ 'border-primary': mapStore.currentMapId === map.id }"
		>
			<div class="p-2">
				<p class="text-white uppercase font-bold">{{ map.slug }}</p>
			</div>
		</div>
	</nav>
</template>
