import { EventEmitter } from "node:events";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { type InferInput, object, optional, parse, string } from "valibot";

const app = new Hono();

const AddCommentSchema = object({ text: string() });
const AddReactionSchema = object({
	src: string(),
	left: optional(string()),
	fontSize: optional(string()),
});

export type MeetEvents =
	| ["comment", InferInput<typeof AddCommentSchema>]
	| ["reaction", InferInput<typeof AddReactionSchema>];

type EventMap = {
	dispose: [];
	"meet:event": MeetEvents;
};

export const createServer = (port: number) => {
	const ee = new EventEmitter<EventMap>();

	app.post("/v1/event/:type", async (c) => {
		try {
			const { type } = c.req.param();
			const body = await c.req.json();

			console.log(type, body);

			switch (type) {
				case "comment": {
					ee.emit("meet:event", type, parse(AddCommentSchema, body));

					break;
				}
				case "reaction": {
					ee.emit("meet:event", type, parse(AddReactionSchema, body));

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
