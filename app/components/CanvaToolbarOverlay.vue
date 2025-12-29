<script setup>
import { useDrawingStore } from "../../stores/useDrawingStore.js";

const drawingStore = useDrawingStore();

const handleToolClick = (tool) => {
	if (['undo', 'redo', 'trash', 'fullscreen'].includes(tool.type)) {
		// C'est une action immédiate
		if (tool.type === 'trash') drawingStore.clearCurrentMap();
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
	<div class="absolute top-1/2 -translate-y-1/2 left-4 z-50 border-2 border-gray-border bg-gray-darker text-gray-lighter p-2 rounded">
		<p v-for="tool in drawingStore.tools"
		   :key="tool.type"
		   class="tool"
		   :class="{ active: tool.type === drawingStore.currentTool }"
		   @click="handleToolClick(tool)"
		><i :class="tool.icon"></i></p>
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
