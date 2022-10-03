// lib
import reusableLoad from '$lib/markdown/item/page';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	return reusableLoad('projects', event);
};
