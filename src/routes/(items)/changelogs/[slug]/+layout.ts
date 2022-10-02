// lib
import { reusableLoad } from '$lib/layout/item/index';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	return reusableLoad(event);
};
