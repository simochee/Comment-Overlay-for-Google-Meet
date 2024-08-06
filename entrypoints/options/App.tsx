import { isDeepEqual } from "@antfu/utils";
import { useState } from "react";
import {
	VarButton,
	VarCategory,
	VarColor,
	VarNumber,
	VarSelect,
	VarString,
	VarToggle,
	VarUI,
} from "react-var-ui";
import {
	COMMENT_LEADING_OPTIONS,
	COMMENT_SPEED_OPTIONS,
	type ConfigSchema,
	FONT_WEIGHT_OPTIONS,
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
			<VarCategory label="General" collapsible>
				<VarToggle path="enableByDefault" label="Enable by Default" />
			</VarCategory>
			<VarCategory label="Font" collapsible>
				<VarNumber path="fontSize" label="Size" min={1} />
				<VarString path="fontFamily" label="Family" />
				<VarColor path="fontColor" label="Color" alpha />
				<VarSelect
					path="fontWeight"
					label="Weight"
					options={FONT_WEIGHT_OPTIONS}
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
				<VarNumber path="commentOffsetTop" label="Offset Top" min={0} />
				<VarSelect
					path="commentSpeed"
					label="Speed"
					options={COMMENT_SPEED_OPTIONS}
				/>
				<VarSelect
					path="commentLeading"
					label="Leading"
					options={COMMENT_LEADING_OPTIONS}
				/>
			</VarCategory>
		</VarUI>
	);
};
