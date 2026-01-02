<script setup>
import { useDrawingStore, STROKE_SIZES } from "../stores/useDrawingStore.js";
import { useMapStore } from "../stores/useMapStore.js";

const drawingStore = useDrawingStore();
const mapStore = useMapStore();

// On extrait les IDs des tailles [1, 2, 3] depuis l'objet de config du store
const strokeSizeIds = Object.keys(STROKE_SIZES).map(Number);

const showExtraParams = computed(() =>
	['pen', 'arrow', 'square', 'circle'].includes(drawingStore.currentTool)
);

const handleToolClick = (tool) => {
	if (['undo', 'redo', 'trash', 'fullscreen'].includes(tool.type)) {
		// C'est une action immédiate
		if (tool.type === 'trash') drawingStore.clearMap(mapStore.getCurrentMap.slug, false);
		if (tool.type === 'undo') drawingStore.undoOnCurrentMap();
		if (tool.type === 'fullscreen') drawingStore.toggleFullscreenMode();
		// On ne change pas le currentTool ici !
	} else {
		// C'est un mode de dessin (pointer, pen, circle...)
		drawingStore.selectTool(tool.type);
	}
};
</script>

<template>
	<div class="absolute top-1/2 -translate-y-1/2 left-4 z-50 border-2 border-gray-border bg-gray-darker text-gray-lighter p-2 rounded flex">
		<div>
			<p v-for="tool in drawingStore.tools"
			   :key="tool.type"
			   class="tool"
			   :class="{ active: tool.type === drawingStore.currentTool }"
			   @click="handleToolClick(tool)"
			><i :class="tool.icon"></i></p>
		</div>

		<div class="pl-2" :class="{ hidden: showExtraParams === false }">
			<p v-for="id in strokeSizeIds"
			   :key="id"
			   class="tool flex justify-center items-center"
			   :class="{ active: drawingStore.currentStrokeWidthTool === id }"
			   @click="drawingStore.selectStrokeWidthSize(id)"
			>
				<i class="fa-solid fa-circle"
				   :style="{ fontSize: (4 + id * 4) + 'px' }"
				></i>
			</p>
		</div>
	</div>
</template>

<style scoped>
.tool {
	cursor: pointer;
	@apply bg-gray-medium rounded p-2 text-center mb-2 last:mb-0 w-10 h-10;

	&:hover {
		@apply bg-gray-light text-white;
	}

	&.active {
		@apply bg-primary text-white;
	}

	&:active {
		@apply bg-primary text-white;
	}
}
</style>
