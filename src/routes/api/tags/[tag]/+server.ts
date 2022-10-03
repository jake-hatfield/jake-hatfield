// lib
import { handleApiError } from '$lib/utilities/api';
import { getAllItems } from '$lib/markdown';

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

	const rawItems = getAllItems();

	const items = Object.keys(rawItems).map((index) => {
		const { createdAt, excerpt, image, readingTime, tags, title, slug, updatedAt } =
			rawItems[+index];

		return {
			createdAt,
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
