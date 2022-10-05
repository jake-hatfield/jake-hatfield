// svelte
import { sveltekit } from '@sveltejs/kit/vite';

// packages
import type { UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

const config: UserConfig = {
	plugins: [imagetools(), sveltekit()],
	server: {
		port: 3000,
		strictPort: false,
	},
};

export default config;
