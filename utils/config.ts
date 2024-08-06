import type { IVarSelectOption } from "react-var-ui";
import { storage } from "wxt/storage";

export type ConfigSchema = {
	fontSize: number;
	fontFamily: string;
	fontColor: string;
	fontWeight: number;
	fontStrokeWidth: number;
	fontStrokeColor: string;
	commentSpeed: number;
	commentLeading: number;
};

export const initialConfig: ConfigSchema = {
	fontSize: 64,
	fontFamily: "sans-serif",
	fontColor: "#ffffffff",
	fontWeight: 400,
	fontStrokeWidth: 6,
	fontStrokeColor: "#000000ff",
	commentSpeed: 0.375,
	commentLeading: 1.5,
};

export const configStorage = storage.defineItem<ConfigSchema>("local:config", {
	version: 1,
});

export const FONT_WEIGHT_OPTIONS: IVarSelectOption[] = [
	{ key: 100, label: "100 - Thin" },
	{ key: 200, label: "200 - Extra Light" },
	{ key: 300, label: "300 - Light" },
	{ key: 400, label: "400 - Normal" },
	{ key: 500, label: "500 - Medium" },
	{ key: 600, label: "600 - Semi Bold" },
	{ key: 700, label: "700 - Bold" },
	{ key: 800, label: "800 - Extra Bold" },
	{ key: 900, label: "900 - Black" },
] as const;

export const COMMENT_SPEED_OPTIONS: IVarSelectOption[] = [
	{ key: 0.2, label: "Slow" },
	{ key: 0.375, label: "Normal" },
	{ key: 0.5, label: "Fast" },
] as const;

export const COMMENT_LEADING_OPTIONS: IVarSelectOption[] = [
	{ key: 1, label: "None", value: 1 },
	{ key: 1.25, label: "Tight" },
	{ key: 1.375, label: "Snug" },
	{ key: 1.5, label: "Normal" },
	{ key: 1.625, label: "Relaxed" },
	{ key: 2, label: "Loose" },
] as const;
