import browser from "webextension-polyfill";

const waitFor = async (selector: string) =>
	new Promise<Element>((resolve) => {
		const el = document.querySelector(selector);

		if (el) {
			resolve(el);
		} else {
			new Promise((resolve) => setTimeout(resolve, 1000))
				.then(() => waitFor(selector))
				.then(resolve);
		}
	});

const observeChildren = (
	parent: Element | null,
	callback: (mutation: MutationRecord) => void | Promise<void>,
) => {
	if (!parent) return () => {};

	const observer = new MutationObserver(async (mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				await callback(mutation);
			}
		}
	});

	observer.observe(parent, { childList: true });

	return () => observer.disconnect();
};

const sendComment = (el: HTMLElement) => {
	const text = el.querySelector("[jscontroller=RrV5Ic]")?.textContent;

	if (!text) return;

	browser.runtime.sendMessage({
		type: "comment",
		text,
	});
};

const observeComments = async () => {
	const parent = await waitFor("[jsname=xySENc]");

	console.log("connected to comments");

	let disconnect = () => {};

	observeChildren(parent, async (mutation) => {
		const el = mutation.addedNodes[0];

		if (!(el instanceof HTMLElement)) return;

		disconnect();

		disconnect = observeChildren(
			el.querySelector(".beTDc"),
			async (mutation) => {
				const el = mutation.addedNodes[0];

				if (!(el instanceof HTMLElement)) return;

				sendComment(el);
			},
		);

		sendComment(el);
	});
};

const observeReactions = async () => {
	const parent = await waitFor("[jscontroller=e9oqqf] [jsname=YQuObe]");

	console.log("connected to reactions");

	observeChildren(parent, async (mutation) => {
		const el = mutation.addedNodes[0];

		if (!(el instanceof HTMLElement)) return;

		const payload = {
			type: "reaction",
			src: el
				.querySelector("img")
				?.getAttribute("src")
				?.replace(/72\.png$/, "512.webp"),
			name: el.querySelector("div > div")?.textContent,
			left: el.style.left,
			size: el.querySelector("div")?.style.fontSize,
		};

		browser.runtime.sendMessage(payload);
	});
};

const observeAudiences = async () => {
	const parent = await waitFor("[jsname=jrQDbd]");

	console.log("connected to audiences");

	observeChildren(parent, async (mutation) => {
		const el = mutation.addedNodes[0] || mutation.removedNodes[0];

		if (!(el instanceof HTMLElement)) return;

		browser.runtime.sendMessage({
			type: mutation.addedNodes[0] ? "join" : "leave",
			avatar: el.querySelector("img")?.getAttribute("src"),
			name: el.querySelector(".zWGUib")?.textContent,
		});
	});
};

observeComments();
observeReactions();
observeAudiences();
