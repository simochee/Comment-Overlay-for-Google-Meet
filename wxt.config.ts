import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Comment Overlay for Google Meet",
		permissions: ["storage"],
	},
	modules: ["@wxt-dev/module-react"],
});
