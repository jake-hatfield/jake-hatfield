// lib
import { reusableLoad } from '$lib/layout/index';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	return reusableLoad(event);
};
