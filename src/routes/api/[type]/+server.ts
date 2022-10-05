// lib
import { handleApiError } from '$lib/utilities/api';
import getItems from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';
import type EndpointError from '$types/Error';

export const GET: RequestHandler = async ({ params, url }) => {
	let error: EndpointError;

	const { type } = params;

	const types = ['articles', 'changelogs', 'projects'] as const;

	if (!type) {
		error = {
			code: 'NOT_FOUND',
			message: 'An item type is required',
			suggestion: 'Try entering an item type in the URL',
		};

		return handleApiError(url.pathname, 404, error, { items: [] });
	}

	if (!types.includes(type)) {
		error = {
			code: 'INVALID_TYPE',
			message: `${type} is not a valid item type`,
			suggestion: 'Try entering a valid item type',
		};

		return handleApiError(url.pathname, 400, error, { items: [] });
	}

	const limit = url.searchParams.get('limit');

	const rawItems = getItems(type, limit);

	const items = Object.keys(rawItems).map((index) => {
		const {
			createdAt,
			description,
			excerpt,
			image,
			readingTime,
			slug,
			tags,
			title,
			type,
			updatedAt,
		} = rawItems[+index];

		return {
			createdAt,
			description,
			excerpt,
			image,
			readingTime,
			slug,
			tags,
			title,
			type,
			updatedAt,
		};
	});

	return new Response(JSON.stringify(items));
};
