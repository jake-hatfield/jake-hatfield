// types
import type { PageLoad } from './$types';
import type { FinalizedItem } from '$types/markdown/Item';

const FEATURED_PROJECT_SLUG = 'leadgeek-v2';
const SECONDARY_PROJECT_SLUGS = ['transform-writing', 'graphene'];

export const load: PageLoad = async ({ fetch }) => {
	const [articlesRes, imagePlaceholdersRes, projectsRes] = await Promise.all([
		fetch('/api/items/articles?limit=2'),
		fetch('/api/images', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				images: ['avatar.jpeg'],
			}),
		}),
		fetch('/api/items/projects'),
	]);

	const articles: FinalizedItem[] = await articlesRes.json();
	const { imagePlaceholders }: { imagePlaceholders: string[] } = await imagePlaceholdersRes.json();
	const allProjects: FinalizedItem[] = await projectsRes.json();

	const featuredProject =
		allProjects.find((project) => project.slug === FEATURED_PROJECT_SLUG) ??
		allProjects.find((project) => project.isFeatured) ??
		allProjects[0];

	const secondaryProjects = SECONDARY_PROJECT_SLUGS.map((slug) =>
		allProjects.find((project) => project.slug === slug),
	).filter((project): project is FinalizedItem => Boolean(project));

	return { articles, featuredProject, imagePlaceholders, projects: secondaryProjects };
};
