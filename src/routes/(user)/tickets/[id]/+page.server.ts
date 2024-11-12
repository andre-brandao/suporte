import type { PageServerLoad } from './$types';

import { ticketC } from '$lib/server/db/controller';

export const load = (async ({ params }) => {
	const ticketId = Number(params.id);

	const info = ticketC.getById(ticketId);
	return {
		info
	};
}) satisfies PageServerLoad;
