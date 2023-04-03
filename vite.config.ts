// node
import fs from 'fs';

// svelte
import { sveltekit } from '@sveltejs/kit/vite';

// packages
import type { UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

const rawFonts = (ext: string[]) => {
	return {
		name: 'vite-plugin-raw-fonts',
		transform(code, id: string) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		},
	};
};

const config: UserConfig = {
	plugins: [imagetools(), sveltekit(), rawFonts(['.ttf'])],
	server: {
		port: 3000,
		strictPort: false,
	},
};

export default config;
