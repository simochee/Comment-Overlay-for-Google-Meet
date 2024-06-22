import { type BrowserWindow, screen } from "electron";

export const moveToScreen = (index: number, window: BrowserWindow) => {
	const { workArea } = screen.getAllDisplays()[index];

	window.setBounds({
		x: workArea.x,
		y: workArea.y,
		width: workArea.width,
		height: workArea.height,
	});
};
