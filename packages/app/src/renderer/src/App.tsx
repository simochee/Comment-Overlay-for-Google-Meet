import { useSettings } from "./hooks/useSettings";

export const App = () => {
	const settings = useSettings();

	return (
		<>
			<p>hello</p>
			{settings.reaction.enabled && <p>Reaction enabled.</p>}
		</>
	);
};
