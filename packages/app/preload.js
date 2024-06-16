const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("events", {
	on: (callback) => ipcRenderer.on("event", (_, values) => callback(values)),
});
