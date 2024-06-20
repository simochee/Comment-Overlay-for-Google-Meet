import { join } from "node:path";
import {
	type BrowserWindow,
	Menu,
	Tray,
	app,
	nativeImage,
	screen,
} from "electron";
import { moveToScreen } from "./screen";

export const createMenu = (window: BrowserWindow) => {
	const menu = Menu.buildFromTemplate([
		{
			label: "Overlay Screen",
			submenu: screen.getAllDisplays().map((display, index) => ({
				label: display.label,
				type: "radio",
				checked: index === 0,
				click() {
					moveToScreen(index, window);
				},
			})),
		},
		{
			label: "Help",
			submenu: [
				{
					label: "Developer Tools",
					click() {
						window.webContents.openDevTools({ mode: "detach" });
					},
				},
				{
					label: "Move to Primary Screen",
					click() {
						moveToScreen(0, window);
					},
				},
				{
					label: "Relaunch",
					click() {
						app.relaunch({
							args: process.argv.slice(1).concat(["--relaunch"]),
						});
						app.exit(0);
					},
				},
			],
		},
		{
			label: "Quit",
			click() {
				app.quit();
			},
		},
	]);

	const tray = new Tray(
		nativeImage.createFromPath(
			join(__dirname, "../../../extension/public/icon@16w.png"),
		),
	);

	tray.setContextMenu(menu);
};
