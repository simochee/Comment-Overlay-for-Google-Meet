import browser from "webextension-polyfill";
import { observer } from "./observer";

browser.action.onClicked.addListener((tab) => {
	if (!tab?.id) return;

	browser.scripting.executeScript({
		target: { tabId: tab.id },
		func: observer,
	});
});
