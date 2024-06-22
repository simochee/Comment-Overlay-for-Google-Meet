import { electron } from "@renderer/utils/electron";
import type { HelperCommentPayload } from "@repo/types/src";
import { useEffect, useState } from "react";
// @ts-expect-error
import styles from "./index.module.css";

type Comment = { id: number; lane: number; ts: number } & HelperCommentPayload;

type Props = {
	fontFamily: string;
	fontSize: string;
};

const MAX_LANES = 5;

export const CommentOverlay = ({ fontFamily, fontSize }: Props) => {
	const [comments, setComments] = useState<Comment[]>([]);

	const deleteComment = (id: number) => {
		setComments((value) => value.filter((comment) => comment.id !== id));
	};

	useEffect(() => {
		return electron.ipcRenderer.on(
			"meet:comment",
			(_, payload: HelperCommentPayload) => {
				setComments((value) => {
					const id = Math.max(0, ...value.map(({ id }) => id)) + 1;
					const timestamp = Date.now();

					const tsByLanes = value.reduce(
						(acc, { lane, ts }) => {
							if (acc[lane] == null) return acc;

							acc[lane] = ts;
							return acc;
						},
						Array.from({ length: MAX_LANES }, () => 0),
					);

					let nextLane = tsByLanes.findIndex((ts) => timestamp - ts > 4_000);

					if (nextLane === -1 || nextLane > MAX_LANES) {
						if (value.length === 0) {
							nextLane = 0;
						} else if (value.length <= MAX_LANES) {
							nextLane = value.length;
						} else {
							nextLane = tsByLanes.indexOf(Math.min(...tsByLanes));
						}
					}

					return value.concat({
						id,
						lane: nextLane,
						ts: timestamp,
						...payload,
					});
				});
			},
		);
	}, []);

	return (
		<div className={styles.wrapper} style={{ fontFamily, fontSize }}>
			{comments.map(({ id, lane, text }) => (
				<p
					key={id}
					className={styles.text}
					style={{
						top: `${lane * 2}em`,
					}}
					onAnimationEnd={() => deleteComment(id)}
					dangerouslySetInnerHTML={{
						__html: text.replace(/\n/g, "<br />"),
					}}
				/>
			))}
		</div>
	);
};
