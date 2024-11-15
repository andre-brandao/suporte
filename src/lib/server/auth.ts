import type { RequestEvent } from '@sveltejs/kit';
import { eq, getTableColumns } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCase, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCase(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.sessionT).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { passwordHash, ...rest } = getTableColumns(table.userT);
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { ...rest },
			session: table.sessionT
		})
		.from(table.sessionT)
		.innerJoin(table.userT, eq(table.sessionT.userId, table.userT.id))
		.where(eq(table.sessionT.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.sessionT).where(eq(table.sessionT.id, session.id));
		return { session: null, user: null };
	}

	const renewSession =
		Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.sessionT)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.sessionT.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<
	ReturnType<typeof validateSessionToken>
>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.sessionT).where(eq(table.sessionT.id, sessionId));
}

export function setSessionTokenCookie(
	event: RequestEvent,
	token: string,
	expiresAt: Date
) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
