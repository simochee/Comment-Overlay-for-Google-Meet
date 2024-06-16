import type browser from "webextension-polyfill";

const { PACKAGE_VERSION = "0.0.0", PACKAGE_DESCRIPTION = "" } = process.env;
const GOOGLE_MEET_MATCHER = "https://meet.google.com/*";

const BASE_MANIFEST = {
	name: "Comment Overlay for Google Meet",
	version: PACKAGE_VERSION,
	description: PACKAGE_DESCRIPTION,
	icons: {
		32: "icons/icon-32.png",
		48: "icons/icon-48.png",
		96: "icons/icon-96.png",
		128: "icons/icon-128.png",
	},
	permissions: ["activeTab", "scripting", "storage"],
	content_scripts: [
		{
			run_at: "document_idle",
			matches: [GOOGLE_MEET_MATCHER],
			js: ["scripts/meet-helper.ts"],
		},
	],
} satisfies Partial<browser.Manifest.WebExtensionManifest>;

const BACKGROUND_ENTRY = "scripts/background.ts";

export const getManifest = (
	browser: string,
): browser.Manifest.WebExtensionManifest => {
	switch (browser) {
		case "firefox":
			return {
				...BASE_MANIFEST,
				manifest_version: 2,
				browser_action: {},
				background: {
					scripts: [BACKGROUND_ENTRY],
				},
			};
		default:
			return {
				...BASE_MANIFEST,
				manifest_version: 3,
				host_permissions: [],
				action: {},
				background: {
					type: "module",
					service_worker: BACKGROUND_ENTRY,
				},
			};
	}
};
