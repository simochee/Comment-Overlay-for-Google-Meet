import type { ElectronAPI } from "@electron-toolkit/preload";
import type { api as API } from ".";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: API;
	}
}
