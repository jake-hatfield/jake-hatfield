// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const url = '/changelogs.json';

	const res = await fetch(url);

	if (res.ok) {
		return {
			articles: await res.json(),
		};
	}

	throw error(500, `Could not load ${url}`);
};
