// lib
import reusableLoad from '$lib/markdown/item/layout';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	return reusableLoad(event);
};
