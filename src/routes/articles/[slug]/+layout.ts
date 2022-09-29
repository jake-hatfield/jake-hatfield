// svelte
import { error } from '@sveltejs/kit';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, url }) => {
	const jsonUrl = url.pathname.replace(/\/\s*$/, '') + '.json';

	const res = await fetch(jsonUrl);

	if (!res.ok) {
		throw error(500, `Could not load ${jsonUrl}`);
	}

	return {
		article: await res.json(),
	};
};
