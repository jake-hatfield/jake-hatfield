// svelte
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

// packages
import { mdsvex } from 'mdsvex';

// lib
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsvex(mdsvexConfig),
		preprocess({ postcss: true, preserve: ['module', 'ld+json'] }),
	],
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter(),
		alias: {
			$assets: './src/assets/*',
			$components: './src/lib/components/*',
			$stores: './src/stores/*',
			$routes: './src/routes/*',
			$types: './src/types/*',
		},
	},
};

export default config;
