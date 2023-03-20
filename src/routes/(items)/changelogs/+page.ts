// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [changelogsRes] = await Promise.all([fetch('/api/items/changelogs')]);

	if (!changelogsRes.ok) {
		throw error(500, `Error fetching changelogs for this page`);
	}

	return {
		changelogs: await changelogsRes.json(),
	};
};
