import { CommentOverlay } from "./components/CommentOverlay";
import { useSettings } from "./hooks/useSettings";

export const App = () => {
	const settings = useSettings();

	return (
		<>
			<p>hello</p>
			{settings.reaction.enabled && <p>Reaction enabled.</p>}
			<CommentOverlay
				fontFamily={settings.comment.font.family}
				fontSize={settings.comment.font.size}
			/>
		</>
	);
};
