// packages
import { readingTime } from 'reading-time-estimator';

// types
import type { FinalizedItem, Item, Types } from '$types/markdown/Item';

// helpers to import the relevant markdown folder
const articles = import.meta.glob('$lib/markdown/articles/*.md', { eager: true });
const changelogs = import.meta.glob('$lib/markdown/changelogs/*.md', { eager: true });
const projects = import.meta.glob('$lib/markdown/projects/*.md', { eager: true });

export default (type: Types) => {
	// get the requested imports
	const imports = getImports(type);

	// get the items from the imports
	const items = getItemsFromImports(imports);

	// get all the tags from the items
	const allTagsAndItems = getAllTagsAndItems(items);

	// group the items by tags
	const categories = groupItemsByTags(allTagsAndItems);

	const getRelatedItems = (item: Item) => {
		let allRelatedItems: Item[] = [];

		// get items with same tags
		for (const tag of item.tags) {
			allRelatedItems = allRelatedItems.concat(categories[tag]);
		}

		const relatedItems: {
			item: FinalizedItem;
			count: number;
			createdAt: string;
		}[] = [];

		// sort by number of similar tags
		for (const relatedItem of allRelatedItems) {
			if (relatedItem.slug === item.slug) {
				continue;
			}

			const rel = relatedItems.find((i) => i.item.slug === relatedItem.slug);

			if (rel) {
				rel.count++;
			} else {
				relatedItems.push({
					item: { ...relatedItem, readingTime: readingTime(relatedItem.html).text },
					count: 1,
					createdAt: relatedItem.createdAt,
				});
			}
		}

		return relatedItems;
	};

	return filterItems(items);
};

export const filterItems = (items: Item[]) => {
	// don't show hidden items
	return (
		items
			.filter((item) => !item.hidden)
			// order items by published date
			.sort((a, b) =>
				new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
					? -1
					: new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
					? 1
					: 0,
			)
			// assign the calculated reading time and related items to each item
			.map((item) => {
				const readingTimeDuration = readingTime(item.html).text;
				// const relatedItems = getRelatedItems(item);

				return {
					...item,
					readingTime: readingTimeDuration,
					// relatedItems: relatedItems
					// 	// order the related items by date created
					// 	.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					// 	// get the most relevant items with overlapping tags
					// 	.sort((a, b) => b.count - a.count)
					// 	// get 3
					// 	.slice(0, 3)
					// 	.map((x) => x.item),
				};
			})
	);
};

export const getAllItems = () => {
	const allImports = { ...articles, ...changelogs, ...projects };

	const items = getItemsFromImports(allImports);

	console.log(items);

	return filterItems(items);
};

const getAllTagsAndItems = (items: Item[]) => {
	return (
		items
			// only show items that aren't hidden
			.filter((i) => !i.hidden)
			// get the tag and the item
			.map((item) => {
				return item.tags.map((tag: string) => {
					return { tag, item };
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
	const items: Item[] = [];

	// loop over the files in the found folder
	for (const path in imports) {
		const item = imports[path];

		if (item) {
			// set the slug to the file name
			const slug = path
				// remove everything before the file name
				.substring(path.lastIndexOf('/') + 1)
				// remove the ".md" extension
				.split('.')[0]
				// make sure it's lower case
				.toLowerCase();

			// add it to the items variable with the slug and rendered output
			items.push({
				slug,
				...item.metadata,
				...item.default.render(),
			});
		}
	}

	return items;
};

const groupItemsByTags = (array: { tag: string; item: Item }[]) => {
	return array.reduce((acc, value) => {
		const property = value['tag'];
		acc[property] = acc[property] || [];
		acc[property].push(value['item']);
		return acc;
	}, {});
};
