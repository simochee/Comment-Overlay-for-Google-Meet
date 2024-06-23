import type { ElectronAPI } from "@electron-toolkit/preload";

// @ts-expect-error
export const electron: ElectronAPI = window?.electron;
