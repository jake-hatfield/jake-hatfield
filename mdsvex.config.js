// packages
import relativeImages from 'mdsvex-relative-images';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

export default {
	extensions: ['.md'],
	rehypePlugins: [
		// Adds 'target' and 'rel' to external links
		rehypeExternalLinks,
		// Adds 'id' attributes to Headings (h1,h2,etc)
		rehypeSlug,
		[
			rehypeAutolinkHeadings,
			{
				// Adds hyperlinks to the headings, requires rehypeSlug
				behavior: 'append',
				content: {
					type: 'element',
					tagName: 'span',
					properties: { className: ['anchorLink'] },
					children: [{ type: 'text', value: '#' }],
				},
			},
		],
	],
	remarkPlugins: [relativeImages],
};
