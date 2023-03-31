// svelte
import { error } from '@sveltejs/kit';

// lib
import metadata from '$lib/metadata';
import { capitalize, titleCase } from '$lib/utilities/string';

export default async ({ fetch, url }) => {
	const res = await fetch(`/api/items${url.pathname.replace(/\/\s*$/, '')}`);

	if (!res.ok) {
		throw error(500, `Could not load`);
	}

	const item = await res.json();

	const title = titleCase(item.title);
	const seoProps = {
		breadcrumbs: [
			{ title: capitalize(item.type), slug: item.type },
			{ title, slug: item.slug },
		],
		createdAt: item.createdAt,
		entityMeta: {
			url: metadata.siteUrl,
			faviconWidth: 512,
			faviconHeight: 512,
			caption: metadata.siteTitle,
		},
		isMarkdownItem: true,
		keywords: item.keywords ?? [],
		kind: item.type,
		metaDescription: item.summary,
		shortMetaDescription: item.description,
		readingTime: item.readingTime,
		slug: `${item.type}/${item.slug}`,
		title,
		updatedAt: item.updatedAt ? item.updatedAt : item.createdAt,
	};

	return {
		item,
		seoProps,
	};
};
