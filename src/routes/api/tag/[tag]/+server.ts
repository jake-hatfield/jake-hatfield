// lib
import { handleApiError } from '$lib/utilities/api';
import { groupAllItemsByTag, getCategory } from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';
import type EndpointError from '$types/Error';

export const GET: RequestHandler = async ({ params, url }) => {
	let error: EndpointError;

	const { tag } = params;

	if (!tag) {
		error = {
			code: 'NOT_FOUND',
			message: 'An item tag is required',
			suggestion: 'Try entering an item tag in the URL',
		};

		return handleApiError(url.pathname, 404, error, { items: [] });
	}

	const category = getCategory(tag);

	const items = Object.keys(category).map((index) => {
		const { createdAt, description, excerpt, image, readingTime, tags, title, slug, updatedAt } =
			category[+index];

		return {
			createdAt,
			description,
			excerpt,
			image,
			readingTime,
			slug,
			tags,
			title,
			updatedAt,
		};
	});

	return new Response(JSON.stringify(items));
};
