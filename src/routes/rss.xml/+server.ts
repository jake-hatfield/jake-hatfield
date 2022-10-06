// lib
import metadata from '$lib/metadata';
import { getAllItems } from '$lib/markdown/index';

// types
import type { FinalizedItem } from '$types/markdown/Item';

// destructure
const { description, siteUrl, siteTitle } = metadata;

const assetsUrl = `${siteUrl}/_app/immutable/assets`;

export const GET = async () => {
	// create the xml body
	const body = xml(getAllItems());

	// set the headers
	const options = {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml',
		},
	};

	return new Response(body, options);
};

const xml = (items: FinalizedItem[]) => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <description>${description}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
			.map(
				(item) => `
        <item>
        <guid isPermaLink="true">${siteUrl}/${item.type}/${item.slug}</guid>
        <title>${item.title}</title>
        <description>${item.description}</description>
        <link>${siteUrl}/${item.type}/${item.slug}</link>
        <pubDate>${new Date(item.createdAt).toUTCString()}</pubDate>
        ${item.tags ? item.tags.map((tag) => `<category term="${tag}" />`).join('') : ''}
        <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${assetsUrl}/${
					item.slug
				}/${item.slug}.jpeg"/>
        <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${assetsUrl}/${
					item.slug
				}/${item.slug}.jpeg"/>
        <content:encoded>
        ${item.excerpt}
        </content:encoded>
        </item>
      `,
			)
			.join('')}
  </channel>
</rss>`;
