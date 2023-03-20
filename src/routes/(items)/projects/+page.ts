// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [projectsRes] = await Promise.all([fetch('/api/items/projects')]);

	if (!projectsRes.ok) {
		throw error(500, `Error fetching projects for this page`);
	}

	return {
		projects: await projectsRes.json(),
	};
};
