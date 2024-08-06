import { storage } from "wxt/storage";

export type ConfigSchema = {
	fontSize: number;
	fontFamily: string;
	fontColor: string;
	fontWeight: number;
	fontStrokeWidth: number;
	fontStrokeColor: string;
	commentSpeed: "slow" | "normal" | "fast";
	commentLeading: "tight" | "normal" | "loose";
};

export const initialConfig: ConfigSchema = {
	fontSize: 64,
	fontFamily: "sans-serif",
	fontColor: "#ffffffff",
	fontWeight: 400,
	fontStrokeWidth: 6,
	fontStrokeColor: "#000000ff",
	commentSpeed: "normal",
	commentLeading: "normal",
};

export const configStorage = storage.defineItem<ConfigSchema>("local:config", {
	version: 1,
});
