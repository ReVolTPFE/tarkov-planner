<script setup>
import { useImage } from "vue-konva";
import { useMapStore } from "../../stores/useMapStore.js";
import { useDrawingStore } from "../../stores/useDrawingStore.js";
import CanvaToolbarOverlay from "./CanvaToolbarOverlay.vue";

const mapStore = useMapStore();
const drawingStore = useDrawingStore();
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
	draggable: false
});

// On synchronise le draggable avec l'outil sélectionné
watch(() => drawingStore.currentTool, (newTool) => {
	stageConfig.draggable = (newTool === 'pointer');
}, { immediate: true });

const fitStageToImage = () => {
	if (!mapImage.value || !container.value) return;

	const stageWidth = container.value.offsetWidth;
	const stageHeight = container.value.offsetHeight;
	const imgWidth = mapImage.value.width;
	const imgHeight = mapImage.value.height;

	// On calcule le ratio pour que l'image tienne dans le cadre (contain)
	const ratio = Math.min(stageWidth / imgWidth, stageHeight / imgHeight);

	// On applique le scale et on centre l'image
	stageConfig.scaleX = ratio;
	stageConfig.scaleY = ratio;
	stageConfig.x = (stageWidth - imgWidth * ratio) / 2;
	stageConfig.y = (stageHeight - imgHeight * ratio) / 2;
};

watch(mapImage, () => {
	if (mapImage.value) {
		fitStageToImage();
	}
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
	// temp, on garde la 1e map par défaut au F5
	mapStore.selectMap(1);

	updateCanvasSize();

	window.addEventListener('resize', updateCanvasSize);
	document.addEventListener('fullscreenchange', updateCanvasSize);
});

const updateCanvasSize = () => {
	if (container.value) {
		stageConfig.width = container.value.offsetWidth;
		stageConfig.height = container.value.offsetHeight;

		// Recentrer la map après le resize
		fitStageToImage();
	}
};

const handleMouseDown = (e) => {
	if (e.evt.button === 1) {
		e.evt.preventDefault();

		stageConfig.draggable = true;

		const stage = e.target.getStage();
		// On force Konva à démarrer le drag immédiatement
		stage.startDrag();

		return; // On arrête là, on ne veut pas dessiner avec la molette
	}

	const stage = e.target.getStage();
	const pos = stage.getRelativePointerPosition(); // Position adaptée au zoom/pan

	if (pos) {
		drawingStore.startShape(pos);
	}
};

const handleMouseMove = (e) => {
	// Si on ne dessine pas, on ne calcule rien pour économiser le CPU
	if (!drawingStore.isDrawing) return;

	const stage = e.target.getStage();
	const pos = stage.getRelativePointerPosition();

	if (pos) {
		drawingStore.updateShape(pos);
	}
};

const handleMouseUp = (e) => {
	// Si on lâche la molette, on désactive le drag (sauf si l'outil actuel est le pointer)
	if (e.evt.button === 1) {
		if (drawingStore.currentTool !== 'pointer') {
			stageConfig.draggable = false;
		}
		return;
	}

	drawingStore.stopDrawing();
};
</script>

<template>
	<div id="canva" ref="container" class="w-full h-full border-2 border-gray-border overflow-hidden relative rounded">
		<CanvaToolbarOverlay />

		<ClientOnly fallback="Loading canva...">
			<!-- Si on sort du cadre, ça stoppe le dessin au mouseleave -->
			<v-stage
				:config="stageConfig"
				@wheel="handleWheel"
				@mousedown="handleMouseDown"
				@mousemove="handleMouseMove"
				@mouseup="handleMouseUp"
				@mouseleave="handleMouseUp"
				@contextmenu="(e) => e.evt.preventDefault()"
			>
				<v-layer>
					<v-image :config="mapImageConfig" />

					<template v-for="shape in drawingStore.activeMapShapes" :key="shape.id">
						<v-line v-if="shape.type === 'pen' || shape.type === 'line'" :config="shape" />
					</template>
				</v-layer>
			</v-stage>
		</ClientOnly>
	</div>
</template>
