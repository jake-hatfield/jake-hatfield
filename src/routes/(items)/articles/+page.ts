// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [articlesRes] = await Promise.all([fetch('/api/articles')]);

	if (!articlesRes.ok) {
		throw error(500, `Error fetching articles for this page`);
	}

	return {
		articles: await articlesRes.json(),
	};
};
