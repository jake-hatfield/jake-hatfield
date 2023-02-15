// lib
import { handleApiError } from '$lib/utilities/api';
import getItems from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';
import type EndpointError from '$types/Error';

export const GET: RequestHandler = async ({ params, url }) => {
	let error: EndpointError;

	const { type, item: queriedItem } = params;

	const types = ['articles', 'changelogs', 'projects'] as const;

	if (!type) {
		error = {
			code: 'NOT_FOUND',
			message: 'An item type is required',
			suggestion: 'Try entering an item type in the URL',
		};

		return handleApiError(url.pathname, 404, error, { item: null });
	}

	if (!types.includes(type)) {
		error = {
			code: 'INVALID_TYPE',
			message: `${type} is not a valid item type`,
			suggestion: 'Try entering a valid item type',
		};

		return handleApiError(url.pathname, 404, error, { item: null });
	}

	const item = getItems(type, null).find((item) => item.slug === queriedItem);

	if (!item) {
		error = {
			code: 'NOT_FOUND',
			message: `No item found`,
			suggestion: 'Try entering a different item',
		};

		return handleApiError(url.pathname, 404, error, { item: null });
	}

	return new Response(JSON.stringify(item), {
		status: 200,
	});
};
