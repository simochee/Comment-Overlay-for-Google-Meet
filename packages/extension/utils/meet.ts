import type { HelperCommentPayload, HelperReactionPayload } from "@repo/types";
import browser from "webextension-polyfill";
import { observeChildren, waitFor } from "./dom";

const sendComment = (el: Node) => {
	if (!(el instanceof HTMLElement)) return;

	const text = el.querySelector("[jscontroller=RrV5Ic]")?.textContent;

	if (!text) return;

	const payload: HelperCommentPayload = {
		type: "comment",
		text,
	};

	browser.runtime.sendMessage(payload);
};

const sendReaction = (el: Node) => {
	if (!(el instanceof HTMLElement)) return;

	const src = el
		.querySelector("img")
		?.getAttribute("src")
		?.replace(/72\.png$/, "512.webp");

	console.log(src);

	if (!src) return;

	const payload: HelperReactionPayload = {
		type: "reaction",
		src,
		left: el.style.left,
		size: el.querySelector("div")?.style.fontSize,
	};

	browser.runtime.sendMessage(payload);
};

/** コメントを監視する */
export const observeComments = async () => {
	const parent = await waitFor("[jsname=xySENc]");

	let disconnect = () => {};

	observeChildren(parent, async (mutation) => {
		const [el] = mutation.addedNodes;

		if (!(el instanceof HTMLElement)) return;

		sendComment(el);

		disconnect();
		disconnect = observeChildren(
			el.querySelector(".beTDc"),
			async (mutation) => {
				const [el] = mutation.addedNodes;

				sendComment(el);
			},
		);
	});
};

/** リアクションを監視する */
export const observeReactions = async () => {
	const parent = await waitFor("[jsname=YQuObe]");

	observeChildren(parent, async (mutation) => {
		const [el] = mutation.addedNodes;

		sendReaction(el);
	});
};
