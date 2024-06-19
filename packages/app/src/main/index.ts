import { app } from "electron";
import { createMenu } from "./menu";
import { createServer } from "./server";
import { createWindow } from "./window";

app.whenReady().then(() => {
	const overlayWindow = createWindow();
	createMenu(overlayWindow);
	const server = createServer(9902);

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
