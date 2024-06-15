import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import { getManifest } from "./manifest";

const { BROWSER = "chrome" } = process.env;

export default defineConfig({
	plugins: [
		webExtension({
			disableAutoLaunch: true,
			browser: BROWSER,
			manifest: () => getManifest(BROWSER),
		}),
	],
});
