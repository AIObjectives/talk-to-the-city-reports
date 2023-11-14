import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	alias: {
		$lib: './src/lib',
		$components: './src/components',
		$routes: './src/routes'
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
