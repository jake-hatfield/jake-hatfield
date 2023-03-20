// lib
import { handleApiError } from '$lib/utilities/api';
import { getCategory } from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';
import type { EndpointError } from '$types/Error';

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

	if (!category) {
		error = {
			code: 'NOT_FOUND',
			message: 'No items found for this tag',
			suggestion: 'Try entering an item tag in the URL',
		};

		return handleApiError(url.pathname, 404, error, { items: [] });
	}

	const items = category.items.map((index) => {
		const {
			createdAt,
			description,
			excerpt,
			image,
			readingTime,
			slug,
			tag,
			title,
			type,
			updatedAt,
		} = index;

		return {
			createdAt,
			description,
			excerpt,
			image,
			readingTime,
			slug,
			tag,
			title,
			type,
			updatedAt,
		};
	});

	return new Response(JSON.stringify(items));
};
