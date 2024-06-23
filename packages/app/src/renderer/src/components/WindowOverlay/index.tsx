// @ts-expect-error
import styles from "./index.module.css";

type Props = {
	hasBorder: boolean;
};

export const WindowOverlay = ({ hasBorder }: Props) => {
	return <>{hasBorder && <div className={styles.border} />}</>;
};
