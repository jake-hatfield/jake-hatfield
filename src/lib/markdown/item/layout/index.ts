// svelte
import { error } from '@sveltejs/kit';

export default async ({ fetch, url }) => {
	const res = await fetch(`/api${url.pathname.replace(/\/\s*$/, '')}`);

	if (!res.ok) {
		throw error(500, `Could not load`);
	}

	const item = await res.json();

	console.log(item);

	return {
		item,
	};
};
