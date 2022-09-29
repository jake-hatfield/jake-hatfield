// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const url = '/articles.json';

	const res = await fetch(url);

	if (!res.ok) {
		throw error(500, `Could not load ${url}`);
	}

	return {
		articles: await res.json(),
	};
};
