import { defineContentScript } from "wxt/sandbox";
import { observeComments, observeReactions } from "../utils/meet";

export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://meet.google.com/*"],
	main() {
		observeComments();
		observeReactions();
	},
});
