/* eslint-disable @typescript-eslint/no-unused-vars */
import { ticketT, userT, ticketMessagesT, tagsT } from './schema';
import type {
	InsertTag,
	InsertTicket,
	InsertTicketMessage,
	Tag,
	Ticket,
	TicketMessage
} from './schema';

import { db } from '.';
import { eq, getTableColumns } from 'drizzle-orm';
export const ticketC = {
	create: (data: InsertTicket) => {
		return db.insert(ticketT).values(data);
	},
	update: async (id: Ticket['id'], data: Partial<InsertTicket>) => {
		return db.update(ticketT).set(data).where(eq(ticketT.id, id));
	},
	getByUserId: (userId: string) => {
		return db.select().from(ticketT).where(eq(ticketT.userId, userId));
	},
	getById: (id: Ticket['id']) => {
		return db.query.ticketT.findFirst({
			where: eq(ticketT.id, id),
			with: {
				messages: true,
				created_by: true
			}
		});
	},
	getAll: () => db.select().from(ticketT),
	getAllJoinUser: () => {
		const { ...ticketFields } = getTableColumns(ticketT);
		const {
			created_at,
			updated_at,
			deleted_at,
			age,
			passwordHash,
			id: userId,
			...userFields
		} = getTableColumns(userT);
		return db
			.select({ ...userFields, ...ticketFields })
			.from(ticketT)
			.leftJoin(userT, eq(ticketT.userId, userT.id));
	},
	getMessages: (ticketId: Ticket['id']) => {
		return db
			.select()
			.from(ticketMessagesT)
			.where(eq(ticketMessagesT.ticketId, ticketId));
	}
};

export const ticketMessagesC = {
	create: async (data: InsertTicketMessage) => {
		await db
			.update(ticketT)
			.set({ updated_at: new Date() })
			.where(eq(ticketT.id, data.ticketId));
		return db.insert(ticketMessagesT).values(data).returning();
	},
	delete: async (id: TicketMessage['id']) => {
		return db.delete(ticketMessagesT).where(eq(ticketMessagesT.id, id));
	}
};

export const tagsC = {
	create: (data: InsertTag) => db.insert(tagsT).values(data),
	update: (id: Tag['id'], data: Partial<InsertTag>) =>
		db.update(tagsT).set(data).where(eq(tagsT.id, id)),
	getAll: () => db.select().from(tagsT)
};
