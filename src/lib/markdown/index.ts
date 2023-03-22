// packages
import { readingTime } from 'reading-time-estimator';

// lib
import { handlePluralization, kebabCase } from '$lib/utilities/string';

// types
import type { FinalizedItem, Types } from '$types/markdown/Item';

// helpers to import the relevant markdown folder
const articles = import.meta.glob('$lib/markdown/articles/**/*.md', { eager: true });
const changelogs = import.meta.glob('$lib/markdown/changelogs/**/*.md', { eager: true });
const projects = import.meta.glob('$lib/markdown/projects/**/*.md', { eager: true });

export default (type: Types, limit: string | null, hidden = false) => {
	// get the requested imports
	const imports = getImports(type);

	// get the items from those imports
	const items = getItemsFromImports(imports);

	return filterAndSortItems(items, limit, hidden);
};

export const filterAndSortItems = (
	items: FinalizedItem[],
	limit: string | null,
	hidden: boolean,
) => {
	return (
		items
			// don't show hidden items
			.filter((item) => (hidden ? true : !item.hidden))
			// order items by published date
			.sort((a, b) =>
				new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
					? -1
					: new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
					? 1
					: 0,
			)
			// limit the number of items as requested
			.slice(0, limit ? +limit : items.length)
	);
};

export const formatPath = (path: string) =>
	path.slice(0, path.lastIndexOf('/')).split(`/`).splice(5).join('/');

export const getAllItems = (hidden = false) => {
	const allImports = import.meta.glob('$lib/markdown/**/*.md', { eager: true });

	const allItems = getItemsFromImports(allImports);

	return filterAndSortItems(allItems, null, hidden);
};

export const getAllCategories = () => {
	const items = getAllItems();

	return groupItemsByTags(
		items
			.filter((item) => !item.hidden)
			.map((item) => {
				return { tag: item.tag, item };
			}),
	);
};

export const getCategory = (category: string) => {
	const categories = getAllCategories();

	return categories.find((c) => c.tag === category);
};

export const getImports = (type: Types) => {
	// import the relevant markdown folder
	let imports: Record<string, unknown> = {};

	// assign the imports to the type requested
	switch (type) {
		case 'articles':
			imports = articles;
			break;
		case 'changelogs':
			imports = changelogs;
			break;
		case 'projects':
			imports = projects;
			break;
		default:
			break;
	}

	return imports;
};

const getItemsFromImports = (imports: Record<string, unknown>) => {
	const items: FinalizedItem[] = [];

	// loop over the files in the found folder
	for (const path in imports) {
		const item = imports[path];

		if (item) {
			// render the content of the item
			const output = item.default.render();

			// estimate the reading time
			const unformattedType = path.split('markdown/')[1].split('/')[0];

			// add it to the items variable with the slug, excerpt, reading time, and rendered output
			items.push({
				excerpt: output.html
					.replace(/<[^>]+>/g, '')
					.substring(0, 275)
					.trim(),
				readingTime: readingTime(output.html).text,
				slug: formatPath(path),
				tag: kebabCase(item.metadata.tag),
				type: unformattedType,
				...item.metadata,
				...output,
			});
		}
	}

	return items;
};

export const groupItemsByTags = (items: { tag: string; item: FinalizedItem }[]) =>
	items.reduce((acc, { tag, item }) => {
		const foundValue = acc.find((a) => a.tag === tag);

		if (foundValue) {
			// add onto the existing category in the array
			foundValue.items.push(item);
		} else {
			// create a new category in the array
			acc.push({
				tag,
				items: [item],
			});
		}
		// if tag exists, add the item to the items array for that tag
		// otherwise create a new tag to the accumulator
		return acc;
	}, []);

export const typeGuardPost = (type: string): type is Types => {
	return ['articles', 'changelogs', 'projects'].includes(type);
};
