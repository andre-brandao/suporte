import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

const timestamps = {
	created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull(),
	updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull(),
	deleted_at: timestamp('deleted_at', { withTimezone: true, mode: 'date' })
};

export const userT = pgTable('user', {
	...timestamps,
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const sessionT = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userT.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof sessionT.$inferSelect;

export type User = typeof userT.$inferSelect;

export const ticketStatusEnum = ['new', 'open', 'pending', 'solved', 'closed'] as const;
export type TicketStatus = (typeof ticketStatusEnum)[number];

export const tiketsT = pgTable('tikets', {
	...timestamps,
	id: serial('id').primaryKey(),
	userId: text('user_id').references(() => userT.id),
	subject: text('subject').notNull(),
	tags: integer('tags').references(() => tagsT.id),
	...timestamps
});

export const ticketMessagesT = pgTable('ticket_messages', {
	id: serial('id').primaryKey(),
	...timestamps,
	created_by: text('created_by')
		.notNull()
		.references(() => userT.id)
});

export const tagsT = pgTable('tags', {
	...timestamps,
	id: serial('id').primaryKey(),
	title: text('title').notNull()
});
