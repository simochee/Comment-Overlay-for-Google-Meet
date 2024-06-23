import browser from "webextension-polyfill";
import { defineBackground } from "wxt/sandbox";

const browserAction = browser.action || browser.browserAction;

const getActiveTabId = async () => {
	const values = await browser.storage.local.get("tabId");

	return values?.tabId ?? null;
};

export default defineBackground({
	type: "module",
	main() {
		// ストレージの状態に連動してアイコンバッジを更新する
		browser.storage.local.onChanged.addListener((values) => {
			if ("tabId" in values && values.tabId.newValue) {
				browserAction.setBadgeText({ text: "●" });
				browserAction.setBadgeTextColor({ color: "white" });
				browserAction.setBadgeBackgroundColor({ color: "red" });
			} else {
				browserAction.setBadgeText({ text: "" });
			}
		});

		// アイコンクリック時にタブIDを保存する

		browserAction.onClicked.addListener(async (tab) => {
			const activeTabId = await getActiveTabId();

			if (!tab.url) return;

			if (activeTabId) {
				browser.storage.local.clear();
				return;
			}

			const { hostname } = new URL(tab.url);

			if (hostname === "meet.google.com" && tab.id != null) {
				browser.storage.local.set({ tabId: tab.id });
			}
		});

		// タブが閉じられたときに保存したタブIDを削除する
		browser.tabs.onRemoved.addListener(async (tabId) => {
			const activeTabId = await getActiveTabId();

			if (tabId === activeTabId) {
				browser.storage.local.clear();
			}
		});

		// Google Meet から離脱したときに保存したタブIDを削除する
		browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
			const activeTabId = await getActiveTabId();

			console.log(changeInfo, tab);

			if (tabId === activeTabId && !tab.url?.includes("meet.google.com")) {
				browser.storage.local.clear();
			}
		});

		// 拡張機能がインストールされたときにストレージをクリアする
		browser.runtime.onInstalled.addListener(() => {
			browser.storage.local.clear();
		});

		// イベントをアプリにブロードキャストする
		browser.runtime.onMessage.addListener(async (message, sender) => {
			const tabId = await getActiveTabId();

			if (tabId !== sender.tab?.id) return;
			if (!message || typeof message !== "object") return;

			const { type, ...payload } = message;

			switch (type) {
				case "comment":
				case "reaction": {
					await fetch(`http://localhost:9943/v1/event/${type}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payload),
					});

					break;
				}
			}
		});
	},
});
