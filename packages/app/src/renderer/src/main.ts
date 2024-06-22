import "reset-css";
import "./global.css";
import type { ElectronAPI } from "@electron-toolkit/preload";
import type { SettingsSchema } from "../../main/settings";

const electron: ElectronAPI = (window as any).electron;
const initialSettings = (window as any).initialSettings as SettingsSchema;

electron.ipcRenderer.on("meet:comment", (_, payload) => {
	console.log(payload);
});

electron.ipcRenderer.on("meet:reaction", (_, payload) => {
	console.log(payload);
});

electron.ipcRenderer.on("settings:changed", (_, settings: SettingsSchema) => {
	console.log(settings);
});
