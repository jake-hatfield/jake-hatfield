// lib
import getItems from '$lib/markdown';

export const GET = async () => {
	const rawArticles = getItems('articles');

	const articles = Object.keys(rawArticles).map((index) => {
		const { slug, title, date, excerpt, tags, readingTime } = rawArticles[+index];

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			readingTime,
		};
	});

	return new Response(JSON.stringify(articles));
};
