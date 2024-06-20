import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Comment Overlay Helper",
		permissions: ["tabs", "scripting", "storage"],
		action: {},
	},
});
