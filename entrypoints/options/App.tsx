import { isDeepEqual } from "@antfu/utils";
import { useState } from "react";
import {
	VarButton,
	VarCategory,
	VarColor,
	VarNumber,
	VarSelect,
	VarString,
	VarUI,
} from "react-var-ui";
import {
	type ConfigSchema,
	configStorage,
	initialConfig,
} from "~/utils/config";

export const App = () => {
	const [pending, setPending] = useState(false);
	const [initialValues, setInitialValues] = useState<ConfigSchema | null>(null);
	const [values, setValues] = useState<ConfigSchema>(initialConfig);

	const changed = isDeepEqual(values, initialValues);

	const handleSubmit = async (values: ConfigSchema) => {
		setPending(true);
		try {
			await Promise.all([
				configStorage.setValue(values),
				new Promise((resolve) => setTimeout(resolve, 1500)),
			]);

			setInitialValues(values);
		} finally {
			setPending(false);
		}
	};

	useEffect(() => {
		configStorage.getValue().then((values) => {
			setValues(values);
			setInitialValues(values);
		});
	}, []);

	return (
		<VarUI values={values} onChange={setValues}>
			<VarButton
				buttonLabel={
					pending ? "Saving..." : changed ? "No Changes" : "Save Config"
				}
				disabled={pending || changed}
				onClick={() => handleSubmit(values)}
			/>
			<VarCategory label="Font" collapsible>
				<VarNumber path="fontSize" label="Size" min={1} max={256} />
				<VarString path="fontFamily" label="Family" />
				<VarColor path="fontColor" label="Color" alpha />
				<VarSelect
					path="fontWeight"
					label="Weight"
					options={[
						{ key: 100, label: "100 - Thin" },
						{ key: 200, label: "200 - Extra Light" },
						{ key: 300, label: "300 - Light" },
						{ key: 400, label: "400 - Normal" },
						{ key: 500, label: "500 - Medium" },
						{ key: 600, label: "600 - Semi Bold" },
						{ key: 700, label: "700 - Bold" },
						{ key: 800, label: "800 - Extra Bold" },
						{ key: 900, label: "900 - Black" },
					]}
				/>
				<VarNumber
					path="fontStrokeWidth"
					label="Stroke Width"
					min={1}
					max={64}
				/>
				<VarColor path="fontStrokeColor" label="Stroke Color" alpha />
			</VarCategory>
			<VarCategory label="Comment" collapsible>
				<VarSelect
					path="commentSpeed"
					label="Speed"
					options={[
						{ key: "slow", label: "Slow" },
						{ key: "normal", label: "Normal" },
						{ key: "fast", label: "Fast" },
					]}
				/>
				<VarSelect
					path="commentLeading"
					label="Leading"
					options={[
						{ key: "tight", label: "Tight" },
						{ key: "normal", label: "Normal" },
						{ key: "loose", label: "Loose" },
					]}
				/>
			</VarCategory>
		</VarUI>
	);
};
