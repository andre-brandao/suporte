/* eslint-disable @typescript-eslint/no-unused-vars */
import { sql } from 'drizzle-orm';
import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	json,
	jsonb,
	boolean
} from 'drizzle-orm/pg-core';

const timestamps = {
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).$onUpdateFn(() => new Date()),
	deleted_at: timestamp('deleted_at', { withTimezone: true, mode: 'date' })
};

export const userRoleEnum = ['admin', 'user'] as const;
export type UserRole = (typeof userRoleEnum)[number];
export type UserMeta = {
	provider?: string;
};
export const userT = pgTable('user', {
	...timestamps,
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	role: text('role').notNull().$type<UserRole>(),
	passwordHash: text('password_hash').notNull(),
	meta: jsonb('meta').$type<UserMeta>()
});

export const sessionT = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userT.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = typeof sessionT.$inferSelect;
export type User = typeof userT.$inferSelect;

export const ticketStatusEnum = [
	'new',
	'open',
	'pending',
	'solved',
	'closed'
] as const;
export type TicketStatus = (typeof ticketStatusEnum)[number];

export const ticketT = pgTable('tikets', {
	...timestamps,
	id: serial('id').primaryKey(),
	userId: text('user_id').references(() => userT.id),
	subject: text('subject').notNull(),
	tags: integer('tags').array(),
	lastMessage: text('last_message'),
	read: boolean('read').default(false),
	description: text('')
});
export type Ticket = typeof ticketT.$inferSelect;
export type InsertTicket = typeof ticketT.$inferInsert;

export const ticketMessagesTypesEnum = ['text', 'pdf', 'image'] as const;
export type TicketMessagesTypes = (typeof ticketMessagesTypesEnum)[number];
export const ticketMessagesT = pgTable('ticket_messages', {
	id: serial('id').primaryKey(),
	ticketId: integer('ticket_id')
		.references(() => ticketT.id)
		.notNull(),
	...timestamps,
	created_by: text('created_by')
		.notNull()
		.references(() => userT.id),
	type: text('type').notNull(),
	data: text('data').notNull()
});
export type TicketMessage = typeof ticketMessagesT.$inferSelect;
export type InsertTicketMessage = typeof ticketMessagesT.$inferInsert;

export const tagsT = pgTable('tags', {
	...timestamps,
	id: serial('id').primaryKey(),
	title: text('title').notNull()
});

export type Tag = typeof tagsT.$inferSelect;
export type InsertTag = typeof tagsT.$inferInsert;

export const fileT = pgTable('file', {
	...timestamps,
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	size: integer('size').notNull(),
	type: text('type').notNull(),
	data: text('data').notNull()
});
