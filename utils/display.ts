type OnTickHandler = (canvas: HTMLCanvasElement) => void;

/**
 * getDisplayMedia を拡張する
 */
export const extendDisplayMedia = () => {
	const canvas = document.createElement("canvas");
	const video = document.createElement("video");

	video.autoplay = true;

	const getDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(
		navigator.mediaDevices,
	);

	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";
	}

	navigator.mediaDevices.getDisplayMedia = async (
		options?: DisplayMediaStreamOptions,
	) => {
		video.srcObject = await getDisplayMedia(options);

		await new Promise((resolve) => video.addEventListener("play", resolve));
		await new Promise((resolve) => requestAnimationFrame(resolve));

		return canvas.captureStream(30);
	};

	const onTickHandlers: OnTickHandler[] = [];

	const onTick = (callback: OnTickHandler) => {
		onTickHandlers.push(callback);

		return () => {
			onTickHandlers.splice(onTickHandlers.indexOf(callback), 1);
		};
	};

	const streamCanvas = () => {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if (
			canvas.width > 0 &&
			canvas.height > 0 &&
			ctx instanceof CanvasRenderingContext2D
		) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

			for (const handler of onTickHandlers) {
				handler(canvas);
			}
		}

		requestAnimationFrame(streamCanvas);
	};

	streamCanvas();

	return { onTick };
};
