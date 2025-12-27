<script setup>
import { useImage } from "vue-konva";
import { useMapStore } from "../../stores/useMapStore.js";

const mapStore = useMapStore();
const container = ref(null);

const [mapImage] = useImage(computed(() => {
	const url = mapStore.getCurrentMap?.image;

	return url ? `/img/maps/${url}` : "";
}));

const mapImageConfig = computed(() => ({
	x: 0,
	y: 0,
	image: mapImage.value,
}));

const stageConfig = reactive({
	width: 0,
	height: 0,
	scaleX: 1,
	scaleY: 1,
	x: 0,
	y: 0,
	draggable: true
});

const handleWheel = (e) => {
	e.evt.preventDefault();
	const scaleBy = 1.1; // Vitesse du zoom
	const stage = e.target.getStage();
	const oldScale = stage.scaleX();

	// Position de la souris par rapport au canvas
	const pointer = stage.getPointerPosition();

	// Calcul du nouveau scale
	const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

	// Limitation du zoom (optionnel, mais recommandé)
	if (newScale < 0.1 || newScale > 10) return;

	// Calcul de la nouvelle position pour que le zoom reste centré sur la souris
	const mousePointTo = {
		x: (pointer.x - stage.x()) / oldScale,
		y: (pointer.y - stage.y()) / oldScale,
	};

	stageConfig.scaleX = newScale;
	stageConfig.scaleY = newScale;
	stageConfig.x = pointer.x - mousePointTo.x * newScale;
	stageConfig.y = pointer.y - mousePointTo.y * newScale;
};

onMounted(() => {
	if (container.value) {
		stageConfig.width = container.value.offsetWidth;
		stageConfig.height = container.value.offsetHeight;
	}
});
</script>

<template>
	<div id="#canva" ref="container" class="h-full border-2 border-gray-border overflow-hidden">
		<ClientOnly fallback="Loading canva...">
			<v-stage :config="stageConfig" @wheel="handleWheel">
				<v-layer>
					<v-image :config="mapImageConfig" />
				</v-layer>
			</v-stage>
		</ClientOnly>
	</div>
</template>
