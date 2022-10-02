// svelte
import { error } from '@sveltejs/kit';

// lib
import { getImports } from '$lib/markdown';

// types
import type { PageLoad } from './$types';
import type { FinalizedItem, Types } from '$types/markdown/Item';

export default (type: Types) => {
	// Get items' info
	const imports = getImports(type);

	const articles: FinalizedItem[] = [];

	// Get the posts' slugs
	for (const path in imports) {
		const article = imports[path];
		const slug = path
			// remove everything before the file name
			.substring(path.lastIndexOf('/') + 1)
			// remove the ".md" extension
			.split('.')[0]
			.toLowerCase();
		const a = { article, slug };
		articles.push(a);
	}

	// TOOD<Jake>: Create a re-usable load function

	// export const load: PageLoad = ({ params }) => {
	// 	const { slug } = params;

	// 	// Find the post with the slug
	// 	const filteredItem = articles.find((article) => {
	// 		return article.slug.toLowerCase() === slug.toLowerCase();
	// 	});

	// 	if (!filteredItem) {
	// 		throw error(500, 'Could not load item');
	// 	}

	// 	return {
	// 		// Tell page to load that post's module
	// 		page: filteredItem.article.default,
	// 	};
	// };
};
