// svelte
import { error } from '@sveltejs/kit';

// lib
import { getItemModule, typeGuardPost } from '$lib/markdown';

// types
import type { Types } from '$types/markdown/Item';

export default async (type: Types, event) => {
	if (!typeGuardPost(type)) {
		throw error(404, 'Could not load item');
	}

	const slug = event.params.slug?.toLowerCase();

	if (!slug) {
		throw error(404, 'Could not load item');
	}

	const module = await getItemModule(type, slug);

	if (!module) {
		throw error(404, 'Could not load item');
	}

	return {
		page: module.default,
	};
};
