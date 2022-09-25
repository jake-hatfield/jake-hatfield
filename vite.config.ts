// node
import { resolve } from 'path';

// packages
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$assets: resolve('./src/assets'),
			$components: resolve('./src/components'),
			$stores: resolve('./src/stores'),
			$routes: resolve('./src/routes')
		}
	}
};

export default config;
