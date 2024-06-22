import type Conf from "conf/dist/source";
import type { Options } from "conf/dist/source";
import type { BrowserWindow } from "electron";
import Store from "electron-store";

type StoreSchema = {
	"comment.enabled": boolean;
	"comment.font.family": string;
	"comment.font.size": string;
	"reaction.enabled": boolean;
};

const options: Options<StoreSchema> = {
	schema: {
		"comment.enabled": {
			type: "boolean",
			default: true,
		},
		"comment.font.family": {
			type: "string",
			default: "Arial",
		},
		"comment.font.size": {
			type: "string",
			default: "12px",
		},
		"reaction.enabled": {
			type: "boolean",
			default: true,
		},
	},
	watch: true,
	accessPropertiesByDotNotation: true,
};

// @ts-expect-error
export const settings: Conf<StoreSchema> & Pick<Store, "openInEditor"> =
	new Store<StoreSchema>(options);

export const attachListenersSettingsDidChange = (window: BrowserWindow) => {
	settings.onDidAnyChange((newValue) => {
		window.webContents.send("settings:changed", newValue);
	});
};
