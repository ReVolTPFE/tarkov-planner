import { useDrawingStore } from "../stores/useDrawingStore";
import { useMapStore } from "../stores/useMapStore";

export function useCanvaEvents(stageConfig: any) {
	const drawingStore = useDrawingStore();
	const mapStore = useMapStore();
	let rafId: any = null;
	const isErasing = ref(false);

	const handleMouseDown = (e: any) => {
		if (e.evt.button === 1) {
			e.evt.preventDefault();
			stageConfig.draggable = true;
			e.target.getStage().startDrag();
			return;
		}

		if (drawingStore.currentTool === "eraser") {
			isErasing.value = true;
			eraseAtPosition(e.target.getStage());
			return;
		}

		const pos = e.target.getStage().getRelativePointerPosition();
		if (pos) drawingStore.startShape(pos);
	};

	const handleMouseMove = (e: any) => {
		if (rafId) cancelAnimationFrame(rafId);

		rafId = requestAnimationFrame(() => {
			const stage = e.target.getStage();
			const pos = stage.getRelativePointerPosition();

			if (drawingStore.currentTool === "eraser" && isErasing.value) {
				// Optimisé : l'effacement suit le taux de rafraîchissement de l'écran
				eraseAtPosition(stage);
			} else {
				// Dessin classique
				if (!drawingStore.isDrawing) return;
				if (pos) drawingStore.updateShape(pos);
			}
		});
	};

	const handleMouseUp = (e: any) => {
		if (e.evt.button === 1) {
			if (drawingStore.currentTool !== 'pointer') stageConfig.draggable = false;
			return;
		}

		isErasing.value = false;
		drawingStore.stopDrawing();
	};

	// Fonction utilitaire pour effacer dans une zone
	const eraseAtPosition = (stage: any) => {
		const pointerPos = stage.getPointerPosition();
		if (!pointerPos) return;

		// On cherche toutes les formes qui intersectent ce point
		const shapes = stage.getAllIntersections(pointerPos);

		if (shapes.length > 0) {
			const mapSlug = mapStore.getCurrentMap?.slug;
			if (!mapSlug) return;

			shapes.forEach((shape: any) => {
				const shapeId = shape.attrs.id;
				if (shapeId) {
					drawingStore.removeShape(mapSlug, shapeId, false);
				}
			});
		}
	};

	return { handleMouseDown, handleMouseMove, handleMouseUp };
}
