import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		hmr: {
			overlay: false
		}
	},
	resolve: {
		alias: {
			$lib: '/src/lib',
			$components: path.resolve('./src/components'),
			$routes: '/src/routes'
		}
	}
};

export default config;
