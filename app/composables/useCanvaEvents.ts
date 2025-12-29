import { useDrawingStore } from "../../stores/useDrawingStore";

export function useCanvaEvents(stageConfig: any) {
	const drawingStore = useDrawingStore();
	let rafId: any = null;

	const handleMouseDown = (e: any) => {
		if (e.evt.button === 1) {
			e.evt.preventDefault();
			stageConfig.draggable = true;
			e.target.getStage().startDrag();
			return;
		}

		const pos = e.target.getStage().getRelativePointerPosition();
		if (pos) drawingStore.startShape(pos);
	};

	const handleMouseMove = (e: any) => {
		if (!drawingStore.isDrawing) return;
		if (rafId) cancelAnimationFrame(rafId);

		rafId = requestAnimationFrame(() => {
			const pos = e.target.getStage().getRelativePointerPosition();
			if (pos) drawingStore.updateShape(pos);
		});
	};

	const handleMouseUp = (e: any) => {
		if (e.evt.button === 1) {
			if (drawingStore.currentTool !== 'pointer') stageConfig.draggable = false;
			return;
		}
		drawingStore.stopDrawing();
	};

	return { handleMouseDown, handleMouseMove, handleMouseUp };
}
