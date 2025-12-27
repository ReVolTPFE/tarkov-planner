<script setup>
	import { useMapStore } from "../../stores/useMapStore.js";

	const mapStore = useMapStore();

	onMounted(() => {
		mapStore.fetchMaps();
	});
</script>

<template>
	<div class="h-full flex flex-col overflow-hidden bg-gray-darker border-r border-r-gray-border">
		<div class="border-b border-b-gray-border p-4">
			<p class="text-primary font-bold text-xl">OPERATIONS</p>
			<p class="text-gray-light text-sm">SELECT A MAP</p>
		</div>

		<div v-if="mapStore.maps.length" class="flex-1 overflow-y-auto scrollbar-hide p-4">
			<div v-for="map in mapStore.maps" class="my-4 first:mt-0 last:mb-0 bg-gray-medium border-2 border-gray-light rounded">
				<div class="h-32">
					<img :src="`/img/maps/${map.image}`" alt="" class="w-full h-full object-contain">
				</div>
				<div class="p-3">
					<p class="text-white uppercase font-bold">{{ map.slug }}</p>
					<div class="flex justify-between items-end">
						<p class="text-primary uppercase text-sm mt-2">Medium</p>
						<p class="text-sm text-gray-light">8-12</p>
					</div>
				</div>
			</div>
		</div>

		<p class="text-center py-4 border-t border-t-gray-border text-gray-light cursor-pointer">COLLAPSE</p>
	</div>

</template>

<style scoped>
.scrollbar-hide {
	-ms-overflow-style: none;  /* IE et Edge */
	scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
	display: none;  /* Chrome, Safari, Opera */
}
</style>
