import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess({ postcss: true })],
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	kit: {
		adapter: adapter({ runtime: 'nodejs20.x' }),
		alias: {
			$assets: './src/assets/*',
			$components: './src/lib/components/*',
			$routes: './src/routes/*',
			$types: './src/types/*',
		},
	},
};

export default config;
