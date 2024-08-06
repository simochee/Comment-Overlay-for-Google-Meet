import { configStorage } from "~/utils/config";
import { waitFor } from "~/utils/dom";

export default defineContentScript({
	runAt: "document_idle",
	matches: ["https://meet.google.com/*"],
	async main() {
		const { enableByDefault } = await configStorage.getValue();

		if (!enableByDefault) return;

		const button = await waitFor('[jsname=A5il2e][data-panel-id="2"]');

		if (button instanceof HTMLButtonElement) {
			button.click();
		}
	},
});
