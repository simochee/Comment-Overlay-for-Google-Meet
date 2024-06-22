import "reset-css";
import "./global.css";
import type { ElectronAPI } from "@electron-toolkit/preload";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { SettingsSchema } from "../../main/settings";
import { App } from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);

const electron: ElectronAPI = (window as any).electron;
const initialSettings = (window as any).initialSettings as SettingsSchema;

console.log(initialSettings);

electron.ipcRenderer.on("meet:comment", (_, payload) => {
	console.log(payload);
});

electron.ipcRenderer.on("meet:reaction", (_, payload) => {
	console.log(payload);
});

electron.ipcRenderer.on("settings:changed", (_, settings: SettingsSchema) => {
	console.log(settings);
});
