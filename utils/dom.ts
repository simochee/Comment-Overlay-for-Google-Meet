/**
 * セレクタに該当する要素が存在するまで待機する
 */
export const waitFor = (selectors: string, ms = 1000) => {
	return new Promise<Element>((resolve) => {
		const el = document.querySelector(selectors);

		if (el) {
			resolve(el);
		} else {
			new Promise((resolve) => setTimeout(resolve, ms))
				.then(() => waitFor(selectors, ms))
				.then(resolve);
		}
	});
};

/**
 * 子要素の変化を監視する
 */
export const observeChildren = (
	parent: Element | null,
	callback: (mutation: MutationRecord) => void | Promise<void>,
): (() => void) => {
	if (!parent) return () => {};

	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "childList") {
				await callback(mutation);
			}
		}
	});

	observer.observe(parent, { childList: true });

	return () => observer.disconnect();
};
