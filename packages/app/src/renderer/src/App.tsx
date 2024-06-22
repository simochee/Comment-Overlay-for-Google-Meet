import { CommentOverlay } from "./components/CommentOverlay";
import { ReactionOverlay } from "./components/ReactionOverlay";
import { useSettings } from "./hooks/useSettings";

export const App = () => {
	const settings = useSettings();

	return (
		<>
			{settings.comment.enabled && (
				<CommentOverlay
					fontFamily={settings.comment.font.family}
					fontSize={settings.comment.font.size}
				/>
			)}
			{settings.reaction.enabled && <ReactionOverlay />}
		</>
	);
};
