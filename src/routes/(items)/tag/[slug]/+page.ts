// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const { slug } = params;

	const [tagRes] = await Promise.all([fetch(`/api/tag/${slug}`)]);

	if (!tagRes.ok) {
		throw error(500, `Error fetching items matching the tag "${slug}"`);
	}

	return {
		tag: slug,
		items: await tagRes.json(),
	};
};
