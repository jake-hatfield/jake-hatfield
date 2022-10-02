// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';
import type { FinalizedItem } from '$types/markdown/Item';

// Get items' info
const allArticles = import.meta.glob('$lib/articles/*.md', { eager: true });

const articles: FinalizedItem[] = [];

// Get the posts' slugs
for (const path in allArticles) {
	const article = allArticles[path];
	const slug = path
		// remove everything before the file name
		.substring(path.lastIndexOf('/') + 1)
		// remove the ".md" extension
		.split('.')[0]
		.toLowerCase();
	const a = { article, slug };
	articles.push(a);
}

export const load: PageLoad = ({ params }) => {
	const { slug } = params;

	// Find the post with the slug
	const filteredItem = articles.find((article) => {
		return article.slug.toLowerCase() === slug.toLowerCase();
	});

	if (!filteredItem) {
		throw error(500, 'Could not load article');
	}

	return {
		// Tell page to load that post's module
		page: filteredItem.article.default,
	};
};
