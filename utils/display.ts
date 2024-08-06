import { createHiddenElement } from "./canvas";

/**
 * getDisplayMedia を拡張する
 */
export const extendDisplayMedia = async () => {
	const canvas = createHiddenElement("canvas");
	const video = createHiddenElement("video");
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
};
