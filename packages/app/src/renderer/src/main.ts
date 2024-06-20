import "reset-css";
import "./global.css";
import type { ElectronAPI } from "@electron-toolkit/preload";

const electron: ElectronAPI = (window as any).electron;

electron.ipcRenderer.on("meet:comment", (_, payload) => {
	console.log(payload);
});

electron.ipcRenderer.on("meet:reaction", (_, payload) => {
	console.log(payload);
});
