// lib
import getItems from '$lib/markdown';

export const GET = async () => {
	const rawChangelogs = getItems('changelogs');

	const changelogs = Object.keys(rawChangelogs).map((index) => {
		const { slug, title, date, excerpt, tags, readingTime } = rawChangelogs[+index];

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			readingTime,
		};
	});

	console.log(changelogs);

	return new Response(JSON.stringify(changelogs));
};
