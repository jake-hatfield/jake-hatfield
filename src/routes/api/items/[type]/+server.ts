// lib
import { handleApiError } from '$lib/utilities/api';
import getItems, { typeGuardPost } from '$lib/markdown';

// types
import type { RequestHandler } from '@sveltejs/kit';
import type { EndpointError } from '$types/Error';

export const GET: RequestHandler = async (event) => {
	try {
		let error: EndpointError;

		const {
			params: { type },
			url,
		} = event;

		if (!type) {
			error = {
				code: 'NOT_FOUND',
				message: 'An item type is required',
				suggestion: 'Try entering an item type in the URL',
			};

			return handleApiError(url.pathname, 404, error, { items: [] });
		}

		if (!typeGuardPost(type)) {
			error = {
				code: 'INVALID_TYPE',
				message: `${type} is not a valid item type`,
				suggestion: 'Try entering a valid item type',
			};

			return handleApiError(url.pathname, 400, error, { items: [] });
		}

		const rawItems = getItems(type, url.searchParams.get('limit'));

		const items = Object.keys(rawItems).map((index) => {
			const {
				createdAt,
				description,
				hiddenRepo,
				image,
				isIndexed,
				readingTime,
				repository,
				slug,
				summary,
				tag,
				title,
				type,
				updatedAt,
			} = rawItems[+index];

			return {
				createdAt,
				description,
				hiddenRepo,
				image,
				isIndexed,
				readingTime,
				repository,
				slug,
				summary,
				tag,
				title,
				type,
				updatedAt,
			};
		});

		return new Response(JSON.stringify(items));
	} catch (error) {
		return handleApiError(event.url.pathname, 500, error, { items: [] });
	}
};
