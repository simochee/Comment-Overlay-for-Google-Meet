type OnTickHandler = (canvas: HTMLCanvasElement) => void;

export const IDENTITY_DATA_KEY = "data-wxt-identity";
export const IDENTITY_DATA_VALUE = "comment-overlay-for-google-meet";

/**
 * canvas に video のキャプションを描画する
 */
export class ScreenSharingCanvas {
	private onTickHandlers: OnTickHandler[] = [];

	private get canvas() {
		const canvas = document.querySelector(
			`canvas[${IDENTITY_DATA_KEY}="${IDENTITY_DATA_VALUE}"]`,
		);

		return canvas instanceof HTMLCanvasElement ? canvas : null;
	}

	private get video() {
		const video = document.querySelector(
			`video[${IDENTITY_DATA_KEY}="${IDENTITY_DATA_VALUE}"]`,
		);

		return video instanceof HTMLVideoElement ? video : null;
	}

	public async stream() {
		if (this.canvas && this.video) {
			const ctx = this.canvas.getContext("2d");

			this.canvas.width = this.video.videoWidth;
			this.canvas.height = this.video.videoHeight;

			if (
				this.canvas.width > 0 &&
				this.canvas.height > 0 &&
				ctx instanceof CanvasRenderingContext2D
			) {
				ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

				for (const handler of this.onTickHandlers) {
					handler(this.canvas);
				}
			}
		}

		requestAnimationFrame(() => this.stream());
	}

	public onTick(callback: OnTickHandler) {
		this.onTickHandlers.push(callback);

		return () => {
			this.onTickHandlers.splice(this.onTickHandlers.indexOf(callback), 1);
		};
	}
}
