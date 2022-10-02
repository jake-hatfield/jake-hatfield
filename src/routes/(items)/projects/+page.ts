// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [projectssRes] = await Promise.all([fetch('/api/items?type=projects')]);

	if (!projectssRes.ok) {
		throw error(500, `Error fetching projects for this page`);
	}

	return {
		projects: await projectssRes.json(),
	};
};
