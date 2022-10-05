// lib
import metadata from '$lib/metadata';
// import articles from '$lib/articles';

// destructure
const { description, siteUrl, siteTitle } = metadata;

export const GET = async () => {
	const body = xml(articles);
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml',
	};

	return {
		headers,
		body,
	};
};

const xml = (articles) => `
<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <link>${siteUrl}</link>
    <description>${description}</description>
    ${articles
			.map(
				(article) => `
        <item>
          <title>${article.title}</title>
          <description>${article.excerpt}</description>
          <link>${siteUrl}/${article.slug}/</link>
          <pubDate>${new Date(article.date).toISOString()}</pubDate>
          ${article.tags ? article.tags.map((tag) => `<category term="${tag}" />`).join('') : ''}
          <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${siteUrl}/images/articles/${
					article.slug
				}/cover.jpg"/>
          <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${siteUrl}/images/articles/${
					article.slug
				}/cover.jpg"/>
        </item>
      `,
			)
			.join('')}
  </channel>
</rss>`;
