import { defineContentScript } from "wxt/sandbox";
import { extendDisplayMedia } from "~/utils/display";

export default defineContentScript({
	runAt: "document_start",
	matches: ["https://meet.google.com/*"],
	world: "MAIN",
	async main() {
		await extendDisplayMedia();
	},
});
