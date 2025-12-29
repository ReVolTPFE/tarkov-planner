import { useDrawingStore } from "../../stores/useDrawingStore";

export function useCanvaStage(container: Ref<HTMLElement | null>, mapImage: Ref<HTMLImageElement | null>) {
	const drawingStore = useDrawingStore();

	const stageConfig = reactive({
		width: 0,
		height: 0,
		scaleX: 1,
		scaleY: 1,
		x: 0,
		y: 0,
		draggable: false
	});

	const fitStageToImage = () => {
		if (!mapImage.value || !container.value) return;
		const stageWidth = container.value.offsetWidth;
		const stageHeight = container.value.offsetHeight;
		const imgWidth = mapImage.value.width;
		const imgHeight = mapImage.value.height;

		const ratio = Math.min(stageWidth / imgWidth, stageHeight / imgHeight);
		stageConfig.scaleX = ratio;
		stageConfig.scaleY = ratio;
		stageConfig.x = (stageWidth - imgWidth * ratio) / 2;
		stageConfig.y = (stageHeight - imgHeight * ratio) / 2;
	};

	const handleWheel = (e: any) => {
		e.evt.preventDefault();
		const scaleBy = 1.1;
		const stage = e.target.getStage();
		const oldScale = stage.scaleX();
		const pointer = stage.getPointerPosition();

		const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
		if (newScale < 0.1 || newScale > 10) return;

		const mousePointTo = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		stageConfig.scaleX = newScale;
		stageConfig.scaleY = newScale;
		stageConfig.x = pointer.x - mousePointTo.x * newScale;
		stageConfig.y = pointer.y - mousePointTo.y * newScale;
	};

	const updateSize = () => {
		if (container.value) {
			stageConfig.width = container.value.offsetWidth;
			stageConfig.height = container.value.offsetHeight;
			fitStageToImage();
		}
	};

	// Sync draggable
	watch(() => drawingStore.currentTool, (newTool) => {
		stageConfig.draggable = (newTool === 'pointer');
	}, { immediate: true });

	return { stageConfig, handleWheel, updateSize, fitStageToImage };
}
