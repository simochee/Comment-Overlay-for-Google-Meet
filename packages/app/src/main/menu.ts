import { join } from "node:path";
import {
	type BrowserWindow,
	Menu,
	Tray,
	app,
	nativeImage,
	screen,
	shell,
} from "electron";
import { moveToScreen } from "./screen";
import { settings } from "./settings";

export const createMenu = async (window: BrowserWindow) => {
	const menu = Menu.buildFromTemplate([
		{
			label: "Switch Screen",
			submenu: [
				...screen.getAllDisplays().map(
					(display, index) =>
						({
							label: display.label,
							type: "radio",
							checked: index === 0,
							click() {
								moveToScreen(index, window);
							},
						}) as const,
				),
				{
					type: "separator",
				},
				{
					label: "Move to Primary Screen",
					click() {
						moveToScreen(0, window);
					},
				},
			],
		},
		{
			type: "separator",
		},
		{
			label: "Settings",
			submenu: [
				{
					label: "Open in Editor",
					async click() {
						await settings.openInEditor();
					},
				},
			],
		},
		{
			type: "separator",
		},
		{
			label: "Usage",
			async click() {
				await shell.openExternal(
					"https://github.com/simochee/Comment-Overlay-for-Google-Meet#readme",
				);
			},
		},
		{
			label: "Open Developer Tools",
			click() {
				window.webContents.openDevTools({ mode: "detach" });
			},
		},
		{
			label: "Reload Overlay",
			click() {
				window.reload();
			},
		},
		{
			type: "separator",
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
