const {
	app,
	screen,
	Tray,
	Menu,
	nativeImage,
	BrowserWindow,
} = require("electron/main");
const { createServer } = require("node:http");
const { join } = require("node:path");
const {
	createApp,
	createRouter,
	toNodeListener,
	defineEventHandler,
	readBody,
} = require("h3");

require("electron-reload")(__dirname, {
	electron: join(__dirname, "..", "..", "node_modules", ".bin", "electron"),
});

/** @type {import('electron').BrowserWindow} */
let overlay;
let screenIndex = 0;

const icon = nativeImage.createFromPath(
	join(__dirname, "../extension/public/icons/icon-32.png"),
);

const server = createApp();
const router = createRouter();
server.use(router);
server.use(
	defineEventHandler(async (event) => {
		const body = await readBody(event);

		console.log(body);

		overlay?.webContents.send("event", body);

		return { message: "ok" };
	}),
);

const instance = createServer(toNodeListener(server)).listen(9043);

const moveToNextScreen = () => {
	const allDisplays = screen.getAllDisplays();

	screenIndex += 1;
	screenIndex %= allDisplays.length;

	const nextScreen = allDisplays[screenIndex];
	const { x, y, width, height } = nextScreen.bounds;

	console.log(x, y, width, height);

	overlay.setPosition(x, y);
	overlay.setSize(width, height);
};

app.on("quit", () => instance.close());

app.whenReady().then(() => {
	app.dock.hide();
	app.requestSingleInstanceLock();

	const menu = new Menu.buildFromTemplate([
		{
			label: "Move next to screen",
			click: () => moveToNextScreen(),
		},
		{
			label: "Reload",
			click: () => overlay?.reload(),
		},
		{
			label: "DevTools",
			click: () => overlay?.webContents.openDevTools({ mode: "detach" }),
		},
		{
			label: "Quit",
			click: () => app.quit(),
		},
	]);

	const tray = new Tray(icon);
	tray.setContextMenu(menu);

	overlay = new BrowserWindow({
		transparent: true,
		resizable: false,
		frame: false,
		hasShadow: false,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
		},
	});
	overlay.setIgnoreMouseEvents(true);
	overlay.setAlwaysOnTop(true);

	moveToNextScreen();
	overlay.loadFile(join(__dirname, "index.html"));
});
