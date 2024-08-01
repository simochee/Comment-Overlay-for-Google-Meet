import { observeComments } from "@/utils/comment";
import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://meet.google.com/*"],
	async main() {
		observeComments((comment) => {
			console.log(comment);
		});
	},
});
