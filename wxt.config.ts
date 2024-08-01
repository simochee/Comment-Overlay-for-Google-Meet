import { defineConfig } from "wxt";

const { WXT_START_URL } = process.env;
const startUrls: string[] = [];
if (WXT_START_URL) startUrls.push(WXT_START_URL);

export default defineConfig({
	manifest: {
		name: "Comment Overlay for Google Meet",
		permissions: [],
		action: {},
	},
	runner: { startUrls },
});
