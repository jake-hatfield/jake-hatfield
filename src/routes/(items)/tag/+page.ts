// svelte
import { redirect } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	throw redirect(302, '/');
};
