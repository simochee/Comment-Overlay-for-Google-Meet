import { join } from "node:path";
import { type BrowserWindow, Menu, Tray, nativeImage, screen } from "electron";
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
			label: "Move to Primary Screen",
			click() {
				moveToScreen(0, window);
			},
		},
	]);

	const tray = new Tray(
		nativeImage.createFromPath(
			join(__dirname, "../../../extension/public/icons/icon-32.png"),
		),
	);

	tray.setContextMenu(menu);
};
