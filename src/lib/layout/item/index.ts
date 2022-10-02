// svelte
import { error } from '@sveltejs/kit';

export const reusableLoad = async ({ fetch, url }) => {
	const res = await fetch(`/api${url.pathname.replace(/\/\s*$/, '')}`);

	if (!res.ok) {
		throw error(500, `Could not load`);
	}

	return {
		item: await res.json(),
	};
};
