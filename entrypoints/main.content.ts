import { ScreenSharingCanvas } from "@/utils/canvas";
import { defineContentScript } from "wxt/sandbox";
import { CommentStore, observeComments } from "~/utils/comment";
import { COMMENT_OVERLAY_ENABLED_FLAG_NAME } from "~/utils/config";

export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://meet.google.com/*"],
	async main() {
		const screenSharingCanvas = new ScreenSharingCanvas();

		screenSharingCanvas.stream();

		const commentStore = new CommentStore();
		let config = await configStorage.getValue();

		observeComments((comment) => {
			commentStore.add(comment);
		});

		configStorage.watch((newConfig) => {
			config = newConfig;
		});

		screenSharingCanvas.onTick((canvas) => {
			// @ts-expect-error
			if (!window[COMMENT_OVERLAY_ENABLED_FLAG_NAME]) return;

			const ctx = canvas.getContext("2d");

			if (!ctx) return;

			ctx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily}`;
			ctx.fillStyle = config.fontColor;
			ctx.strokeStyle = config.fontStrokeColor;
			ctx.lineWidth = config.fontStrokeWidth;

			const now = Date.now();
			for (const { id, timestamp, line, text } of commentStore.values) {
				const delta =
					((now - timestamp) / config.fontSize) *
					config.fontSize *
					config.commentSpeed;
				const progress = delta / canvas.width;

				const x = canvas.width - delta - progress * ctx.measureText(text).width;
				const y = line * config.fontSize * config.commentLeading + 100;

				if (progress > 1) {
					commentStore.remove(id);
				} else {
					ctx.strokeText(text, x, y);
					ctx.fillText(text, x, y);
				}
			}
		});
	},
});
