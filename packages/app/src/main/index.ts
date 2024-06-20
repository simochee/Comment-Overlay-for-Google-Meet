import { app } from "electron";
import { createMenu } from "./menu";
import { createServer } from "./server";
import { createWindow } from "./window";

app.whenReady().then(() => {
	app.dock.hide();
	app.requestSingleInstanceLock();

	const overlayWindow = createWindow();
	const server = createServer(9902);

	createMenu(overlayWindow);

	server.on("meet_event", (type, payload) => {
		overlayWindow.webContents.send(type, payload);
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
