import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://meet.google.com/*"],
	main() {},
});
