import { relations } from 'drizzle-orm';
import * as table from './schema';

export const userRelations = relations(table.userT, ({ many, one }) => ({
	tickets: many(table.ticketT),
	messages: many(table.ticketMessagesT)
}));

export const ticketRelations = relations(table.ticketT, ({ many, one }) => ({
	created_by: one(table.userT, {
		fields: [table.ticketT.userId],
		references: [table.userT.id]
	}),
	messages: many(table.ticketMessagesT)
}));

export const messagesRelations = relations(
	table.ticketMessagesT,
	({ many, one }) => ({
		ticket: one(table.ticketT, {
			fields: [table.ticketMessagesT.ticketId],
			references: [table.ticketT.id]
		}),
		created_by: one(table.userT, {
			fields: [table.ticketMessagesT.created_by],
			references: [table.userT.id]
		})
	})
);
