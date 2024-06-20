import { EventEmitter } from "node:events";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { type InferInput, object, parse, string } from "valibot";

const app = new Hono();

const AddCommentSchema = object({ text: string() });
const AddReactionSchema = object({
	src: string(),
	left: string(),
	fontSize: string(),
});

export type MeetEvents =
	| ["add_comment", InferInput<typeof AddCommentSchema>]
	| ["add_reaction", InferInput<typeof AddReactionSchema>];

type EventMap = {
	dispose: [];
	meet_event: MeetEvents;
};

export const createServer = (port: number) => {
	const ee = new EventEmitter<EventMap>();

	app.post("/v1/event/:type", async (c) => {
		try {
			const { type } = c.req.param();
			const body = await c.req.parseBody();

			switch (type) {
				case "add_comment": {
					ee.emit("meet_event", type, parse(AddCommentSchema, body));

					break;
				}
				case "add_reaction": {
					ee.emit("meet_event", type, parse(AddReactionSchema, body));

					break;
				}
			}

			return c.json({ ok: true, msg: "success" });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";

			return c.json({ ok: false, msg }, 500);
		}
	});

	const server = serve(
		{
			fetch: app.fetch,
			port,
		},
		() => {
			console.log(`Bypass server is running on port ${port}`);
		},
	);

	ee.once("dispose", () => {
		console.log("Disposing server");

		server.close();
	});

	return ee;
};
