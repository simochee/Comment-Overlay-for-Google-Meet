import { electron } from "@renderer/utils/electron";
import type { HelperReactionPayload } from "@repo/types/src";
import { useEffect, useState } from "react";
// @ts-expect-error
import styles from "./index.module.css";

type Reaction = { id: number } & HelperReactionPayload;

export const ReactionOverlay = () => {
	const [reactions, setReactions] = useState<Reaction[]>([]);

	const deleteReaction = (id: number) => {
		setReactions((value) => value.filter((reaction) => reaction.id !== id));
	};

	useEffect(() => {
		return electron.ipcRenderer.on(
			"meet:reaction",
			(_, payload: HelperReactionPayload) => {
				setReactions((value) => {
					const id = Math.max(0, ...value.map(({ id }) => id)) + 1;
					const emojiId = /\/notoemoji\/[0-9.]+\/([0-9a-f]+)/.exec(
						payload.src,
					)?.[1];
					const src = `https://fonts.gstatic.com/s/e/notoemoji/15.0/${emojiId}/512.webp`;

					return value.concat({ ...payload, id, src });
				});
			},
		);
	}, []);

	return (
		<div className={styles.wrapper}>
			{reactions.map(({ id, src, left, size }) => (
				<img
					key={id}
					src={src}
					className={styles.reaction}
					style={{ left, width: size || "72px" }}
					onAnimationEnd={() => deleteReaction(id)}
				/>
			))}
		</div>
	);
};
