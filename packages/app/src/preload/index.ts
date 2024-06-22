import { exposeElectronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";
import { settings } from "../main/settings";

exposeElectronAPI();

contextBridge.exposeInMainWorld("initialSettings", settings.store);
