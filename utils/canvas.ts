type OnTickHandler = (canvas: HTMLCanvasElement) => void;

export const IDENTITY_ATTRIBUTE = {
	NAME: "data-wxt-id",
	VALUE: "RBt3TDw0UvyXiLz7NxaPU",
};

export const createHiddenElement = <K extends keyof HTMLElementTagNameMap>(
	tagName: K,
) => {
	const element = document.createElement(tagName);

	element.setAttribute(IDENTITY_ATTRIBUTE.NAME, IDENTITY_ATTRIBUTE.VALUE);
	element.style.width = "0";
	element.style.height = "0";
	element.style.overflow = "hidden";
	element.style.position = "absolute";

	document.body.appendChild(element);

	return element;
};

export const getHiddenElement = <K extends keyof HTMLElementTagNameMap>(
	tagName: K,
) => {
	const elements = document.getElementsByTagName(tagName);

	for (const element of elements) {
		if (
			element.getAttribute(IDENTITY_ATTRIBUTE.NAME) === IDENTITY_ATTRIBUTE.VALUE
		) {
			return element;
		}
	}

	return null;
};

/**
 * canvas に video のキャプションを描画する
 */
export class ScreenSharingCanvas {
	private onTickHandlers: OnTickHandler[] = [];

	public async stream() {
		requestAnimationFrame(() => this.stream());

		const canvas = getHiddenElement("canvas");
		const video = getHiddenElement("video");

		if (!canvas || !video) return;

		const ctx = canvas.getContext("2d");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if (
			canvas.width > 0 &&
			canvas.height > 0 &&
			ctx instanceof CanvasRenderingContext2D
		) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

			for (const handler of this.onTickHandlers) {
				handler(canvas);
			}
		}
	}

	public onTick(callback: OnTickHandler) {
		this.onTickHandlers.push(callback);

		return () => {
			this.onTickHandlers.splice(this.onTickHandlers.indexOf(callback), 1);
		};
	}
}
