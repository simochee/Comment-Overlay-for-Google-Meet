import { observeChildren, waitFor } from "./dom";

/** コメントオブジェクト */
export type ParsedComment = {
	text: string;
	author: string | null;
	timestamp: number;
};
/** コールバックメソッド */
type Callback = (comment: ParsedComment) => void | Promise<void>;

/**
 * コメントの要素をオブジェクトに変換する
 */
const parseComment = (el: HTMLElement): ParsedComment | undefined => {
	const text = el.querySelector("[jscontroller=RrV5Ic]")?.textContent ?? null;
	const author = el.querySelector(".poVWob")?.textContent ?? null;

	if (!text) return;

	return { text, author, timestamp: Date.now() };
};

/**
 * コールバックを発火する
 */
const dispatchCallback = (
	el: HTMLElement,
	callback: Callback,
	author?: string | null,
) => {
	const comment = parseComment(el);

	if (comment) {
		if (author) {
			comment.author = author;
		}

		callback(comment);
	}

	return comment;
};

/**
 * コメントの出現を監視する
 */
export const observeComments = async (callback: Callback) => {
	const parent = await waitFor("[jsname=xySENc]");

	let disconnect = () => {};

	observeChildren(parent, async ({ addedNodes: [el] }) => {
		if (!(el instanceof HTMLElement)) return;

		const comment = dispatchCallback(el, callback);

		disconnect();
		disconnect = observeChildren(
			el.querySelector(".beTDc"),
			async ({ addedNodes: [el] }) => {
				if (!(el instanceof HTMLElement)) return;

				dispatchCallback(el, callback, comment?.author);
			},
		);
	});
};

/** 表示中のコメントを管理するクラス */
export class CommentStore {
	private comments: (ParsedComment & { id: number; line: number })[] = [];

	constructor(private maxLines = 5) {}

	public get values() {
		return this.comments;
	}

	public add(comment: ParsedComment) {
		const now = Date.now();
		const linesTimestamp = Array.from({ length: this.maxLines }, (_, index) =>
			Math.max(
				0,
				...this.comments
					.filter(({ line }) => line === index)
					.map(({ timestamp }) => timestamp),
			),
		)
			.map((timestamp, line) => ({ timestamp, line }))
			.toSorted((a, b) => b.timestamp - a.timestamp);
		const id = Math.max(0, ...this.comments.map(({ id }) => id)) + 1;

		for (const { line, timestamp } of linesTimestamp) {
			if (now - timestamp > 1_200) {
				this.comments.push({ ...comment, id, line });
				return;
			}
		}

		this.comments.push({ ...comment, id, line: 0 });
	}

	public remove(id: number) {
		this.comments = this.comments.filter((comment) => comment.id !== id);
	}
}
