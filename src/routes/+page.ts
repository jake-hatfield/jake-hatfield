// types
import type { PageLoad } from './$types';
import type { FinalizedItem } from '$types/markdown/Item';

export const load: PageLoad = async ({ fetch }) => {
	const [articlesRes, changelogsRes, imagePlaceholdersRes, projectsRes] = await Promise.all([
		fetch('/api/articles?limit=3'),
		fetch('/api/changelogs?limit=3'),
		fetch('/api/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				images: ['avatar.png'],
			}),
		}),
		fetch('/api/projects?limit=3'),
	]);

	const articles: FinalizedItem[] = await articlesRes.json();
	const changelogs: FinalizedItem[] = await changelogsRes.json();
	const { imagePlaceholders }: { imagePlaceholders: string[] } = await imagePlaceholdersRes.json();
	const projects: FinalizedItem[] = await projectsRes.json();

	return { articles, changelogs, imagePlaceholders, projects };
};
