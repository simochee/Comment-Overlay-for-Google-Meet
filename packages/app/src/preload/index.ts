import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

export const api = {
	on: (callback: (type: string, values: any) => void) =>
		ipcRenderer.on("meet_event", (_, type, values) => callback(type, values)),
};

if (process.contextIsolated) {
	contextBridge.exposeInMainWorld("electron", electronAPI);
	contextBridge.exposeInMainWorld("api", api);
} else {
	// @ts-expect-error
	window.electron = electronAPI;
	// @ts-expect-error
	window.api = api;
}
