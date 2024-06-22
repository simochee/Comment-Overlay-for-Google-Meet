/** DOM の出現を待つ */
export const waitFor = (selector: string) => {
	return new Promise<Element>((resolve) => {
		const el = document.querySelector(selector);
		if (el) {
			resolve(el);
		} else {
			new Promise((resolve) => setTimeout(resolve, 1000))
				.then(() => waitFor(selector))
				.then(resolve);
		}
	});
};

/** 子要素の変化を監視する */
export const observeChildren = (
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
