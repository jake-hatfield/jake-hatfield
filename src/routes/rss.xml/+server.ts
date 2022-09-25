// lib
import { description, siteBaseUrl, title } from '$lib/metadata';
import articles from '$lib/articles';

export const GET = async () => {
	const body = xml(articles);
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};
	throw new Error(
		'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
	);
	// Suggestion (check for correctness before using):
	// return json(body, {
	// 	headers: headers
	// });
	return {
		headers,
		body
	};
};

const xml = (articles) => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${title}</title>
    <link>${siteBaseUrl}</link>
    <description>${description}</description>
    ${articles
			.map(
				(article) => `
        <item>
          <title>${article.title}</title>
          <description>${article.excerpt}</description>
          <link>${siteBaseUrl}/${article.slug}/</link>
          <pubDate>${new Date(article.date).toISOString()}</pubDate>
          ${article.tags ? article.tags.map((tag) => `<category term="${tag}" />`).join('') : ''}
          <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${siteBaseUrl}/images/articles/${
					article.slug
				}/cover.jpg"/>
          <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${siteBaseUrl}/images/articles/${
					article.slug
				}/cover.jpg"/>
        </item>
      `
			)
			.join('')}
  </channel>
</rss>`;
