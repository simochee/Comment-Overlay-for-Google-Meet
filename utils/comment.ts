import { observeChildren, waitFor } from "./dom";

/** コメントオブジェクト */
type ParsedComment = { text: string };
/** コールバックメソッド */
type Callback = (comment: ParsedComment) => void | Promise<void>;

/**
 * コメントの要素をオブジェクトに変換する
 */
const parseComment = (el: HTMLElement): ParsedComment | undefined => {
	const text = el.querySelector("[jscontroller=RrV5Ic]")?.textContent ?? null;

	if (!text) return;

	return { text };
};

/**
 * コールバックを発火する
 */
const dispatchCallback = (el: HTMLElement, callback: Callback) => {
	const comment = parseComment(el);

	if (comment) callback(comment);
};

/**
 * コメントの出現を監視する
 */
export const observeComments = async (callback: Callback) => {
	const parent = await waitFor("[jsname=xySENc]");

	let disconnect = () => {};

	observeChildren(parent, async ({ addedNodes: [el] }) => {
		if (!(el instanceof HTMLElement)) return;

		dispatchCallback(el, callback);

		disconnect();
		disconnect = observeChildren(
			el.querySelector(".beTDc"),
			async ({ addedNodes: [el] }) => {
				if (!(el instanceof HTMLElement)) return;

				dispatchCallback(el, callback);
			},
		);
	});
};
