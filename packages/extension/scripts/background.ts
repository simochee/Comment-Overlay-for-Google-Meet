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
	} else if (tab.url?.includes("meet.google.com") && tab.id != null) {
		browser.storage.local.set({ tabId: tab.id });

		browser.scripting.executeScript({
			target: { tabId: tab.id },
			func: () => {
				window.addEventListener("beforeunload", () => {
					// @ts-ignore
					chrome.runtime.sendMessage({ type: "disconnect" });
				});
			},
		});
	}
});

browser.tabs.onRemoved.addListener(async (tabId) => {
	const activeTabId = await getActiveTabId();

	if (tabId === activeTabId) {
		browser.storage.local.remove("tabId");
	}
});

browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.clear();
});

browser.runtime.onMessage.addListener(async (message, sender) => {
	const tabId = await getActiveTabId();

	console.log("message", message, tabId, sender.tab?.id);

	if (tabId !== sender.tab?.id) return;

	switch (message.type) {
		case "disconnect":
			browser.storage.local.remove("tabId");
			break;
		default:
			fetch("http://localhost:9043", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(message),
			});
			break;
	}
});
