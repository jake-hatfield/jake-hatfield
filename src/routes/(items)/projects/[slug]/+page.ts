// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';
import type { FinalizedItem } from '$types/markdown/Item';

// Get posts' info
const allChangelogs = import.meta.glob('$lib/projects/*.md', { eager: true });

const changelogs: FinalizedItem[] = [];

// Get the posts' slugs
for (const path in allChangelogs) {
	const changelog = allChangelogs[path];
	const slug = changelog.metadata.slug;
	const p = { changelog, slug };
	changelogs.push(p);
}

export const load: PageLoad = ({ params }) => {
	const { slug } = params;

	// Find the post with the slug
	const filteredChangelog = changelogs.find((changelog) => {
		return changelog.slug.toLowerCase() === slug.toLowerCase();
	});

	if (!filteredChangelog) {
		throw error(500, 'Could not load post');
	}

	return {
		// Tell page to load that post's module
		page: filteredChangelog.changelog.default,
	};
};
