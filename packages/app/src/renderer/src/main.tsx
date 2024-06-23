import "reset-css";
import "./global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
