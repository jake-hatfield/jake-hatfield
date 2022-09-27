// global
import path from 'path';

import type { RequestHandler } from '@sveltejs/kit';

// utils
import { IMAGE_DIR, lowResolutionPlaceholder } from '$lib/utilities/image';
import { handleApiError } from '$lib/utilities/api';

const __dirname = path.resolve();

// @route       POST api/image-placeholders.json
// @description Return low resolution placeholders from images sent to the endpoint
// @access      Public
export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const { images } = await request.json();

		const imagePlaceholderPromises = images.map((image: string) => {
			const source = path.join(__dirname, IMAGE_DIR, image);
			return lowResolutionPlaceholder({ source });
		});

		const imagePlaceholders: string[] = await Promise.all(imagePlaceholderPromises);

		return new Response(JSON.stringify({ imagePlaceholders }));
	} catch (error) {
		return handleApiError(url.pathname, 500, error, { placeholders: [] });
	}
};
