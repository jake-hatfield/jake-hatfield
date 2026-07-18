// lib
import metadata from '$lib/metadata';
import { getAllCategories, getAllItems } from '$lib/markdown';

// types
import type { FinalizedItem } from '$types/markdown/Item';

// destructure
const { siteUrl } = metadata;

export const GET = async () => {
	const [items, categories] = await Promise.all([getAllItems(), getAllCategories()]);

	return new Response(
		xml(items, ['about', 'articles', 'changelogs', 'projects'], categories),
		{
			headers: {
				'Cache-Control': 'max-age=0, s-maxage=3600',
				'Content-Type': 'application/xml',
			},
		},
	);
};

const xml = (
	items: FinalizedItem[],
	pages: string[],
	categories: { tag: string; items: FinalizedItem[] }[],
) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  ${pages
		.map(
			(page) => `
  <url>
    <loc>${siteUrl}/${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  `,
		)
		.join('')}
  ${categories
		.map(
			({ tag }) => `
  <url>
    <loc>${siteUrl}/tags/${tag}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  `,
		)
		.join('')}
  ${items
		.map((item) =>
			item.hidden
				? null
				: `
  <url>
    <loc>${siteUrl}/${item.type}/${item.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  `,
		)
		.join('')}
</urlset>`;
