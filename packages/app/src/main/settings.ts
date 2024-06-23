import type Conf from "conf/dist/source";
import type { Options } from "conf/dist/source";
import type { BrowserWindow } from "electron";
import Store from "electron-store";

export type SettingsSchema = {
	"comment.enabled": boolean;
	"comment.font.family": string;
	"comment.font.weight": string;
	"comment.font.size": string;
	"reaction.enabled": boolean;
	"window.border.enabled": boolean;
};

const options: Options<SettingsSchema> = {
	schema: {
		"comment.enabled": {
			type: "boolean",
			default: true,
		},
		"comment.font.family": {
			type: "string",
			default: "Arial",
		},
		"comment.font.weight": {
			type: "string",
			default: "normal",
		},
		"comment.font.size": {
			type: "string",
			default: "12px",
		},
		"reaction.enabled": {
			type: "boolean",
			default: true,
		},
		"window.border.enabled": {
			type: "boolean",
			default: false,
		},
	},
	watch: true,
	accessPropertiesByDotNotation: true,
};

// @ts-expect-error
export const settings: Conf<SettingsSchema> & Pick<Store, "openInEditor"> =
	// @ts-expect-error
	new Store<SettingsSchema>(options);

export const attachListenersSettingsDidChange = (window: BrowserWindow) => {
	settings.onDidAnyChange((newValue) => {
		window.webContents.send("settings:changed", newValue);
	});
};
