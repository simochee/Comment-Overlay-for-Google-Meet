import type { SettingsSchema } from "@main/settings";
import { electron } from "@renderer/utils/electron";
import { useEffect, useState } from "react";

// @ts-expect-error
const initialSettings: SettingsSchema = window.initialSettings;

export const useSettings = () => {
	const [commentEnabled, setCommentEnabled] = useState(
		initialSettings["comment.enabled"],
	);
	const [commentFontFamily, setCommentFontFamily] = useState(
		initialSettings["comment.font.family"],
	);
	const [commentFontSize, setCommentFontSize] = useState(
		initialSettings["comment.font.size"],
	);
	const [reactionEnabled, setReactionEnabled] = useState(
		initialSettings["reaction.enabled"],
	);

	useEffect(() => {
		return electron.ipcRenderer.on(
			"settings:changed",
			(_, settings: SettingsSchema) => {
				setCommentEnabled(settings["comment.enabled"]);
				setCommentFontFamily(settings["comment.font.family"]);
				setCommentFontSize(settings["comment.font.size"]);
				setReactionEnabled(settings["reaction.enabled"]);
			},
		);
	}, []);

	return {
		comment: {
			enabled: commentEnabled,
			font: {
				family: commentFontFamily,
				size: commentFontSize,
			},
		},
		reaction: {
			enabled: reactionEnabled,
		},
	} as const;
};
