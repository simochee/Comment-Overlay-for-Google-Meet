import { CommentOverlay } from "./components/CommentOverlay";
import { ReactionOverlay } from "./components/ReactionOverlay";
import { WindowOverlay } from "./components/WindowOverlay";
import { useSettings } from "./hooks/useSettings";

export const App = () => {
	const settings = useSettings();

	return (
		<>
			{settings.comment.enabled && (
				<CommentOverlay
					fontFamily={settings.comment.font.family}
					fontWeight={settings.comment.font.weight}
					fontSize={settings.comment.font.size}
				/>
			)}
			{settings.reaction.enabled && <ReactionOverlay />}
			<WindowOverlay hasBorder={settings.window.border.enabled} />
		</>
	);
};
