import type { PageServerLoad } from './$types';
import { tagsC } from '$lib/server/db/controller';

export const load: PageServerLoad = async () => {
	const tags = await tagsC.getAll();
	return { tags };
};
