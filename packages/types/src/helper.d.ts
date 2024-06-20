/** コメントペイロード */
export type HelperCommentPayload = {
	type: "comment";
	text: string;
};

/** リアクションペイロード */
export type HelperReactionPayload = {
	type: "reaction";
	src: string;
	left: string | undefined;
	size: string | undefined;
};
