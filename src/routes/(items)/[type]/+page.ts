// svelte
import { error } from '@sveltejs/kit';

// lib
import { typeGuardPost } from '$lib/markdown';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const { type } = params;

	if (!type || !typeGuardPost(type)) {
		throw error(404, 'Not found');
	}

	const itemsRes = await fetch(`/api/items/${type}`);

	if (!itemsRes.ok) {
		throw error(500, `Error fetching ${type} for this page`);
	}

	return {
		items: await itemsRes.json(),
		type,
	};
};
