// svelte
import { error } from '@sveltejs/kit';

// lib
import { formatPath, getImports } from '$lib/markdown';

// types
import type { FinalizedItem, Types } from '$types/markdown/Item';

export default (type: Types, event) => {
	// Get items' info
	const imports = getImports(type);

	const items: FinalizedItem[] = [];

	// Get the posts' slugs
	for (const path in imports) {
		const item = imports[path];
		const i = { item, slug: formatPath(path) };

		items.push(i);
	}

	// Find the post with the slug
	const filteredItem = items.find((item) => {
		return (
			item.slug.toLowerCase() ===
			`${
				event.params.category ? `${event.params.category.toLowerCase()}/` : ''
			}${event.params.slug.toLowerCase()}`
		);
	});

	if (!filteredItem) {
		throw error(500, 'Could not load item');
	}

	return {
		// Tell page to load that post's module
		page: filteredItem.item.default,
	};
};
