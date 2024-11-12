import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
// import delay from 'delay';

import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { ticketC, tagsC, ticketMessagesC } from '$lib/server/db/controller';
import { ticketMessagesT, ticketT, tagsT } from '$lib/server/db/schema';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const t = initTRPC.context<Context>().create();

export const router = t.router({
	greeting: t.procedure.query(async () => {
		await delay(500); // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	ticket: t.router({
		create: t.procedure
			.input(createInsertSchema(ticketT))
			.mutation(async ({ input }) => {
				return await ticketC.create(input);
			}),
		update: t.procedure
			.input(
				z.object({
					id: z.number(),
					data: createInsertSchema(ticketT).omit({ id: true })
				})
			)
			.mutation(async ({ input }) => {
				return await ticketC.update(input.id, input.data);
			})
	}),
	messages: t.router({
		create: t.procedure
			.input(createInsertSchema(ticketMessagesT))
			.mutation(async ({ input }) => {
				return await ticketMessagesC.create(input);
			})
	}),
	tags: t.router({
		create: t.procedure
			.input(createInsertSchema(tagsT))
			.mutation(async ({ input }) => {
				return await tagsC.create(input);
			}),
		update: t.procedure
			.input(
				z.object({
					id: z.number(),
					data: createInsertSchema(tagsT).omit({ id: true })
				})
			)
			.mutation(async ({ input }) => {
				return await tagsC.update(input.id, input.data);
			})
	})
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
