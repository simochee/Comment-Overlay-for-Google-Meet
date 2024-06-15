import browser from "webextension-polyfill";

export const observer = async () => {
	console.log("observer");
	const browser = await import("webextension-polyfill");
	console.log("hello world");
};
