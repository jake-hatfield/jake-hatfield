// packages
import { readingTime } from 'reading-time-estimator';

// lib
import { kebabCase } from '$lib/utilities/string';

// types
import type { FinalizedItem, Types } from '$types/markdown/Item';

type MarkdownModule = {
	default: {
		render: () => { html: string; css: { code: string; map: null }; head: string };
	};
	metadata: FinalizedItem;
};

type MarkdownImporter = () => Promise<MarkdownModule>;

const articles = import.meta.glob<MarkdownModule>('$lib/markdown/articles/**/*.md');
const changelogs = import.meta.glob<MarkdownModule>('$lib/markdown/changelogs/**/*.md');
const projects = import.meta.glob<MarkdownModule>('$lib/markdown/projects/**/*.md');
const allMarkdown = import.meta.glob<MarkdownModule>('$lib/markdown/**/*.md');

export default async (type: Types, limit: string | null, hidden = false) => {
	const imports = getImportGlob(type);
	const items = await getListItemsFromImports(imports);

	return filterAndSortItems(items, limit, hidden);
};

export const filterAndSortItems = (items: FinalizedItem[], limit: string | null, hidden: boolean) =>
	items
		.filter((item) => (hidden ? true : !item.hidden))
		.sort((a, b) =>
			new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
				? -1
				: new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
				? 1
				: 0,
		)
		.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1))
		.slice(0, limit ? +limit : items.length);

export const formatPath = (path: string) =>
	path.slice(0, path.lastIndexOf('/')).split(`/`).splice(5).join('/');

export const getAllItems = async (hidden = false) => {
	const items = await getListItemsFromImports(allMarkdown);

	return filterAndSortItems(items, null, hidden);
};

export const getAllCategories = async () => {
	const items = await getAllItems();

	return groupItemsByTags(
		items
			.filter((item) => !item.hidden)
			.map((item) => {
				return { tag: item.tag, item };
			}),
	);
};

export const getCategory = async (category: string) => {
	const categories = await getAllCategories();

	return categories.find((c) => c.tag === category);
};

export const getItemBySlug = async (type: Types, slug: string) => {
	const imports = getImportGlob(type);
	const path = findImportPath(imports, slug);

	if (!path) return null;

	const item = await imports[path]();

	return buildFullItem(path, item);
};

export const getItemModule = async (type: Types, slug: string) => {
	const imports = getImportGlob(type);
	const path = findImportPath(imports, slug);

	if (!path) return null;

	return imports[path]();
};

export const getImportGlob = (type: Types) => {
	switch (type) {
		case 'articles':
			return articles;
		case 'changelogs':
			return changelogs;
		case 'projects':
			return projects;
		default:
			return {};
	}
};

const findImportPath = (imports: Record<string, MarkdownImporter>, slug: string) =>
	Object.keys(imports).find((path) => formatPath(path).toLowerCase() === slug.toLowerCase());

const getTypeFromPath = (path: string) => path.split('markdown/')[1].split('/')[0] as Types;

const buildListItem = (path: string, item: MarkdownModule): FinalizedItem => {
	const contentForReadingTime = item.metadata.summary || item.metadata.description || '';

	return {
		readingTime: readingTime(contentForReadingTime).text,
		slug: formatPath(path),
		tag: kebabCase(item.metadata.tag),
		type: getTypeFromPath(path),
		...item.metadata,
		html: '',
		css: { code: '', map: null },
		head: '',
	};
};

const buildFullItem = (path: string, item: MarkdownModule): FinalizedItem => {
	const output = item.default.render();

	return {
		readingTime: readingTime(output.html).text,
		slug: formatPath(path),
		tag: kebabCase(item.metadata.tag),
		type: getTypeFromPath(path),
		...item.metadata,
		...output,
	};
};

const getListItemsFromImports = async (imports: Record<string, MarkdownImporter>) => {
	const entries = await Promise.all(
		Object.entries(imports).map(async ([path, loadModule]) => {
			const item = await loadModule();

			return buildListItem(path, item);
		}),
	);

	return entries;
};

export const groupItemsByTags = (items: { tag: string; item: FinalizedItem }[]) =>
	items.reduce((acc, { tag, item }) => {
		const foundValue = acc.find((a) => a.tag === tag);

		if (foundValue) {
			foundValue.items.push(item);
		} else {
			acc.push({
				tag,
				items: [item],
			});
		}

		return acc;
	}, [] as { tag: string; items: FinalizedItem[] }[]);

export const typeGuardPost = (type: string): type is Types => {
	return ['articles', 'changelogs', 'projects'].includes(type);
};
