// svelte
import { error } from '@sveltejs/kit';

// lib
import { getImports } from '$lib/markdown';

// types
import type { FinalizedItem, Types } from '$types/markdown/Item';

export default (type: Types, event) => {
	// Get items' info
	const imports = getImports(type);

	const items: FinalizedItem[] = [];

	// Get the posts' slugs
	for (const path in imports) {
		const item = imports[path];
		const slug = path
			// remove everything before the file name
			.substring(path.lastIndexOf('/') + 1)
			// remove the ".md" extension
			.split('.md')[0]
			.toLowerCase();
		const i = { item, slug };

		items.push(i);
	}

	const { slug } = event.params;

	// Find the post with the slug
	const filteredItem = items.find((item) => {
		return item.slug.toLowerCase() === slug.toLowerCase();
	});

	if (!filteredItem) {
		throw error(500, 'Could not load item');
	}

	return {
		// Tell page to load that post's module
		page: filteredItem.item.default,
	};
};
