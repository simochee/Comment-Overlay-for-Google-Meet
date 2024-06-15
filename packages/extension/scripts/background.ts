import browser from "webextension-polyfill";

const getActiveTabId = async () => {
	const values = await browser.storage.local.get("tabId");

	return values?.tabId ?? null;
};

browser.storage.local.onChanged.addListener((values) => {
	if ("tabId" in values && values.tabId.newValue) {
		browser.action.setBadgeText({ text: "b" });
		browser.action.setBadgeBackgroundColor({ color: "green" });
	} else {
		browser.action.setBadgeText({ text: "" });
	}
});

browser.action.onClicked.addListener(async (tab) => {
	const tabId = await getActiveTabId();

	if (tabId) {
		browser.storage.local.remove("tabId");
	} else if (tab.url?.includes("meet.google.com")) {
		browser.storage.local.set({ tabId: tab.id });
	}
});

browser.runtime.onMessage.addListener(async (message, sender) => {
	const tabId = await getActiveTabId();

	if (tabId !== sender.tab?.id) return;

	fetch("http://localhost:9001", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(message),
	});
});
