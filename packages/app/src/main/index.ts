import { app } from "electron";
import { createMenu } from "./menu";
import { createServer } from "./server";
import { attachListenersSettingsDidChange } from "./settings";
import { createWindow } from "./window";

app.whenReady().then(() => {
	app.dock.hide();
	app.requestSingleInstanceLock();

	const overlayWindow = createWindow();
	const server = createServer(9943);

	createMenu(overlayWindow);

	attachListenersSettingsDidChange(overlayWindow);

	server.on("meet:event", (type, payload) => {
		overlayWindow.webContents.send(`meet:${type}`, payload);
	});

	app.on("quit", () => server.emit("dispose"));

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
});

process.on("SIGINT", () => {
	app.quit();
});
