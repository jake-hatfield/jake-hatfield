// packages
import { readingTime } from 'reading-time-estimator';

// lib
import { kebabCase } from '$lib/utilities/string';

// types
import type { FinalizedItem, Item, Types } from '$types/markdown/Item';

// helpers to import the relevant markdown folder
const articles = import.meta.glob('$lib/markdown/articles/*.md', { eager: true });
const changelogs = import.meta.glob('$lib/markdown/changelogs/*.md', { eager: true });
const projects = import.meta.glob('$lib/markdown/projects/*.md', { eager: true });

export default (type: Types, limit: string | null) => {
	// get the requested imports
	const imports = getImports(type);

	// get the items from those imports
	const items = getItemsFromImports(imports);

	// get all the tags from the items
	// const allTagsAndItems = getAllTagsAndItems(items);

	// group the items by tags
	// const categories = groupItemsByTags(allTagsAndItems);

	// const getRelatedItems = (item: Item) => {
	// 	let allRelatedItems: Item[] = [];

	// 	// get items with same tags
	// 	for (const tag of item.tags) {
	// 		allRelatedItems = allRelatedItems.concat(categories[tag]);
	// 	}

	// 	const relatedItems: {
	// 		item: FinalizedItem;
	// 		count: number;
	// 		createdAt: string;
	// 	}[] = [];

	// 	// sort by number of similar tags
	// 	for (const relatedItem of allRelatedItems) {
	// 		if (relatedItem.slug === item.slug) {
	// 			continue;
	// 		}

	// 		const rel = relatedItems.find((i) => i.item.slug === relatedItem.slug);

	// 		if (rel) {
	// 			rel.count++;
	// 		} else {
	// 			relatedItems.push({
	// 				item: { ...relatedItem, readingTime: readingTime(relatedItem.html).text },
	// 				count: 1,
	// 				createdAt: relatedItem.createdAt,
	// 			});
	// 		}
	// 	}

	// 	return relatedItems;
	// };

	return filterAndSortItems(items, limit);
};

export const filterAndSortItems = (items: FinalizedItem[], limit: string | null) => {
	return (
		items
			// don't show hidden items
			.filter((item) => !item.hidden)
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

export const getAllItems = () => {
	const allImports = { ...articles, ...changelogs, ...projects };

	const allItems = getItemsFromImports(allImports);

	return filterAndSortItems(allItems, null);
};

export const getAllCategories = () => {
	const items = getAllItems();

	return groupItemsByTags(getAllTagsAndItems(items));
};

export const getCategory = (category: string) => {
	const categories = getAllCategories();

	return categories[category];
};

const getAllTagsAndItems = (items: Item[]) => {
	return (
		items
			// only show items that aren't hidden
			.filter((i) => !i.hidden)
			// get the tag and the item
			.map((item) => {
				return item.tags.map((tag: string) => {
					return { tag: kebabCase(tag), item };
				});
			})
			.flat()
	);
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
			// set the slug to the file name
			const slug = path
				// remove everything before the file name
				.substring(path.lastIndexOf('/') + 1)
				// remove the ".md" extension
				.split('.md')[0]
				// make sure it's lower case
				.toLowerCase();
			// render the content of the item
			const output = item.default.render();
			// estimate the reading time
			const rt = readingTime(output.html).text;

			// add it to the items variable with the slug, excerpt, reading time, and rendered output
			items.push({
				excerpt: output.html
					.replace(/<[^>]+>/g, '')
					.substring(0, 370)
					.trim(),
				readingTime: rt,
				slug,
				...item.metadata,
				...output,
			});
		}
	}

	return items;
};

export const groupAllItemsByTag = () => {
	const allItems = getAllItems();

	const allTagsAndItems = getAllTagsAndItems(allItems);

	return groupItemsByTags(allTagsAndItems);
};

const groupItemsByTags = (items: { tag: string; item: Item }[]) => {
	return items.reduce((acc, value) => {
		const property = value['tag'];
		acc[property] = acc[property] || [];
		acc[property].push(value['item']);
		return acc;
	}, {});
};
