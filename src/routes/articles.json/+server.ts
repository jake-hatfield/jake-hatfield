// lib
import getItems from '$lib/markdown';

export const GET = async () => {
	const rawArticles = getItems('articles');

	const articles = Object.keys(rawArticles).map((index) => {
		const { createdAt, excerpt, html, readingTime, tags, title, slug, updatedAt } =
			rawArticles[+index];

		return {
			createdAt,
			excerpt,
			html,
			readingTime,
			tags,
			title,
			slug,
			updatedAt,
		};
	});

	return new Response(JSON.stringify(articles));
};
