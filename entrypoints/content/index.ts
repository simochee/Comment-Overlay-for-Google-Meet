import { defineContentScript } from "wxt/sandbox";
import {
	CommentStore,
	type ParsedComment,
	observeComments,
} from "~/utils/comment";
import { extendDisplayMedia } from "~/utils/display";

const FONT_SIZE = 64;

export default defineContentScript({
	runAt: "document_start",
	matches: ["https://meet.google.com/*"],
	world: "MAIN",
	main() {
		const { onTick } = extendDisplayMedia();
		const commentStore = new CommentStore();

		observeComments((comment) => {
			commentStore.add(comment);
		});

		onTick((canvas) => {
			const ctx = canvas.getContext("2d");

			if (!ctx) return;

			ctx.font = `${FONT_SIZE}px sans-serif`;
			ctx.strokeStyle = "black";
			ctx.lineWidth = FONT_SIZE / 10;
			ctx.fillStyle = "white";

			console.log(commentStore.values);

			const now = Date.now();
			for (const { id, timestamp, line, text } of commentStore.values) {
				const delta = ((now - timestamp) / FONT_SIZE) * 24;
				const progress = delta / canvas.width;

				const x = canvas.width - delta - progress * ctx.measureText(text).width;

				if (progress > 1) {
					console.log("delete!");
					commentStore.remove(id);
				} else {
					ctx.fillText(text, x, line * FONT_SIZE * 1.1 + 100);
				}
			}
		});
	},
});
