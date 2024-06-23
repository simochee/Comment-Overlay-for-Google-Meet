import { join } from "node:path";
import { is } from "@electron-toolkit/utils";
import { BrowserWindow } from "electron";
import { moveToScreen } from "./screen";

export const createWindow = () => {
	const overlayWindow = new BrowserWindow({
		transparent: true,
		resizable: false,
		focusable: false,
		frame: false,
		hasShadow: false,
		webPreferences: {
			preload: join(__dirname, "../preload/index.mjs"),
			sandbox: false,
		},
	});

	overlayWindow.setIgnoreMouseEvents(true);
	overlayWindow.setAlwaysOnTop(true, "modal-panel", 1);

	moveToScreen(0, overlayWindow);

	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		overlayWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		overlayWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}

	return overlayWindow;
};
