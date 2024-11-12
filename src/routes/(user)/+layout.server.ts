/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LayoutServerLoad } from './$types';
import { tagsC, ticketC } from '$lib/server/db/controller';
import {
	withOrderBy,
	getOrderBy,
	getSQLiteColumn,
	withPagination
} from '$lib/server/db/utils';
import { and, eq, or, like } from 'drizzle-orm';
import { ticketT } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load = (async ({ depends, url, locals }) => {
	depends('tickets');
	const user = locals.user;
	// if (!user) return error(401, 'Unauthorized');
	const tags = await tagsC.getAll();
	let query = ticketC.getAllJoinUser().$dynamic();

	const searchParams = url.searchParams;
	const page = Number(searchParams.get('page') ?? '1');
	const pageSize = Number(searchParams.get('pageSize') ?? '15');

	const orderBy = searchParams.get('orderBy') ?? 'created_at';
	const orderDirection = searchParams.get('orderDirection') ?? 'desc';

	const search = searchParams.get('search');

	// query = query.where(
	// 	and(
	// 		// user?.role === 'admin' ? undefined : eq(ticketT.userId, user?.id ?? '')
	// 		or(like(ticketT.subject, `%${search}%`))
	// 	)
	// );

	if (orderBy && orderDirection) {
		// if (orderColumn) {
		query = withOrderBy(
			query,
			getSQLiteColumn(ticketT, orderBy),
			orderDirection
		);
		// }
	}

	try {
		const result = await withPagination(query, page, pageSize);
		console.log(result);

		return {
			tickets: result,
			tags
		};
	} catch (e) {
		console.error(e);
	}

	return {
		tickets: [],
		tags
	};
}) satisfies LayoutServerLoad;
