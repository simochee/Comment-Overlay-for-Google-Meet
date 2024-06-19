import { app } from "electron";
import { createMenu } from "./menu";
import { createWindow } from "./window";

app.whenReady().then(() => {
	const overlayWindow = createWindow();
	createMenu(overlayWindow);

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
});
