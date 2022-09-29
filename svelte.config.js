// svelte
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

// packages
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

const extensions = ['.svelte', '.md'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
			preserve: ['module', 'ld+json'],
		}),
		mdsvex({
			extensions,
			rehypePlugins: [
				// Adds 'target' and 'rel' to external links
				rehypeExternalLinks,
				// Adds 'id' attributes to Headings (h1, h2, etc.)
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
		}),
	],
	extensions: [...extensions, '.svx'],
	kit: {
		adapter: adapter(),
		alias: {
			$assets: './src/assets/*',
			$components: './src/components/*',
			$stores: './src/stores/*',
			$routes: './src/routes/*',
		},
	},
};

export default config;
