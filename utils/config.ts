import { storage } from "wxt/storage";

export type ConfigSchema = {
	fontSize: number;
	fontFamily: string;
	fontColor: string;
	fontStrokeWidth: number;
	fontStrokeColor: string;
	commentSpeed: "slow" | "normal" | "fast";
	commentLeading: "tight" | "normal" | "loose";
};

export const initialConfig: ConfigSchema = {
	fontSize: 64,
	fontFamily: "sans-serif",
	fontColor: "#ffffffff",
	fontStrokeWidth: 6,
	fontStrokeColor: "#000000ff",
	commentSpeed: "normal",
	commentLeading: "normal",
};

export const configStorage = storage.defineItem<ConfigSchema>("local:config", {
	version: 1,
});
