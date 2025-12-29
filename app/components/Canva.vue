<script setup>
import { useImage } from "vue-konva";
import { useMapStore } from "../../stores/useMapStore.js";
import { useDrawingStore } from "../../stores/useDrawingStore.js";
import { useCanvaStage } from "../composables/useCanvaStage.js";
import { useCanvaEvents } from "../composables/useCanvaEvents.js";

const mapStore = useMapStore();
const drawingStore = useDrawingStore();
const container = ref(null);

// 1. Image management
const [mapImage] = useImage(computed(() =>
	mapStore.getCurrentMap?.image ? `/img/maps/${mapStore.getCurrentMap.image}` : ""
));

// 2. Logic extraction
const { stageConfig, handleWheel, updateSize, fitStageToImage } = useCanvaStage(container, mapImage);
const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvaEvents(stageConfig);

// 3. Lifecycle & Watchers
onMounted(() => {
	mapStore.selectMap(1);
	updateSize();
	window.addEventListener('resize', updateSize);
	document.addEventListener('fullscreenchange', updateSize);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateSize);
	document.removeEventListener('fullscreenchange', updateSize);
});

watch(mapImage, (newImg) => { if (newImg) fitStageToImage(); });
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
					<v-image :config="{ image: mapImage }" />

					<template v-for="shape in drawingStore.activeMapShapes" :key="shape.id">
						<v-line v-if="['pen', 'line'].includes(shape.type)" :config="shape" />

						<v-arrow
							v-if="shape.type === 'arrow'"
							:config="{
								...shape,
								fill: shape.stroke, // La pointe est remplie de la même couleur
								pointerLength: 15,
								pointerWidth: 15
							}"
						/>

						<v-rect v-if="shape.type === 'square'" :config="{
							   x: Math.min(shape.points[0], shape.points[2]),
							   y: Math.min(shape.points[1], shape.points[3]),
							   width: Math.abs(shape.points[2] - shape.points[0]),
							   height: Math.abs(shape.points[3] - shape.points[1]),
							   stroke: shape.stroke,
							   strokeWidth: shape.strokeWidth,
							   lineCap: 'round',
							   lineJoin: 'round'
						   }"
						/>
					</template>
				</v-layer>
			</v-stage>
		</ClientOnly>
	</div>
</template>
