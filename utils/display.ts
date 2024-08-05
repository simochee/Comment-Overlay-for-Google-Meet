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
		...args
	) => {
		video.srcObject = await getDisplayMedia(options);

		await new Promise((resolve) => video.addEventListener("play", resolve));

		streamCanvas();

		return canvas.captureStream(30);
	};

	const streamCanvas = () => {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

		requestAnimationFrame(streamCanvas);
	};

	return canvas;
};
