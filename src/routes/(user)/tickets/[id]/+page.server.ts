import type { PageServerLoad } from './$types';

import { ticketC } from '$lib/server/db/controller';

export const load = (async ({ params }) => {
	const ticketId = Number(params.id);

	const info = await ticketC.getById(ticketId);
	console.log(info);
	return {
		info
	};
}) satisfies PageServerLoad;
