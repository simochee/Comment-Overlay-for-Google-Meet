import { EventEmitter } from "node:events";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

type EventMap = {
	dispose: [];
};

export const createServer = (port: number) => {
	const ee = new EventEmitter<EventMap>();

	app.post("/v1/event", async (c) => {
		const body = await c.req.parseBody();

		console.log(body);

		return c.json({ ok: true });
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
