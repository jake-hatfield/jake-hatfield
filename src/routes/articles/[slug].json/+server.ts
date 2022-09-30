// types
import type { RequestHandler } from '@sveltejs/kit';

// lib
import getItems from '$lib/markdown';

export const GET: RequestHandler = async ({ params }) => {
	const page = getItems('articles').find((a) => a.slug === params.slug);

	if (page) {
		return new Response(JSON.stringify(page), {
			status: 200,
		});
	}

	return new Response(undefined, { status: 404 });
};
