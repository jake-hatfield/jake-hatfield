// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [imagePlaceholdersRes] = await Promise.all([
		fetch('/api/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				images: ['avatar.png'],
			}),
		}),
	]);

	const { imagePlaceholders }: { imagePlaceholders: string[] } = await imagePlaceholdersRes.json();

	return { imagePlaceholders };
};
