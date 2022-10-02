// lib
import getItems from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');

	const rawItems = getItems(type);

	const items = Object.keys(rawItems).map((index) => {
		const { createdAt, excerpt, html, readingTime, tags, title, slug, updatedAt } =
			rawItems[+index];

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

	return new Response(JSON.stringify(items));
};
