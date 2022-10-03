// packages
import { readingTime } from 'reading-time-estimator';

// types
import type { FinalizedItem, Item, Types } from '$types/markdown/Item';

// helpers to import the relevant markdown folder
const articles = import.meta.glob('$lib/markdown/articles/*.md', { eager: true });
const changelogs = import.meta.glob('$lib/markdown/changelogs/*.md', { eager: true });
const projects = import.meta.glob('$lib/markdown/projects/*.md', { eager: true });

export const getImports = (type: Types) => {
	// import the relevant markdown folder
	let imports: Record<string, unknown> = {};

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

export default (type: Types) => {
	const imports = getImports(type);

	// store the items from imports
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
				.toLowerCase();

			// add it to the items variable with the slug and rendered output
			items.push({
				slug,
				...item.metadata,
				...item.default.render(),
			});
		}
	}

	const allTagsAndItems = items
		// only show items that aren't hidden
		.filter((i) => !i.hidden)
		// get the tag and the item
		.map((item) => {
			return item.tags.map((tag: string) => {
				return { tag, item };
			});
		})
		.flat();

	const groupByTags = (array: Item[]) => {
		return array.reduce((acc, value) => {
			const property = value['tag'];
			acc[property] = acc[property] || [];
			acc[property].push(value['item']);
			return acc;
		}, {});
	};

	const getRelatedItems = (item: Item) => {
		let allRelatedItems: Item[] = [];

		// get items with same tags
		for (const tag of item.tags) {
			allRelatedItems = allRelatedItems.concat(categories[tag]);
		}

		const relatedItems: Item[] = [];

		// Sort by number of similar tags
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

	const categories = groupByTags(allTagsAndItems);

	// filter the items and order them by published date
	const filteredItems: FinalizedItem[] = items
		.filter((item) => !item.hidden)
		.sort((a, b) =>
			new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
				? -1
				: new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
				? 1
				: 0,
		)
		.map((item) => {
			const readingTimeDuration = readingTime(item.html).text;

			const relatedItems = getRelatedItems(item);

			return {
				...item,
				readingTime: readingTimeDuration,
				relatedItems: relatedItems
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
					.sort((a, b) => b.count - a.count)
					.slice(0, 3)
					.map((x) => x.item),
			};
		});

	return filteredItems;
};
