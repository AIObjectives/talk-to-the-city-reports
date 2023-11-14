import { sveltekit } from '@sveltejs/kit/vite';

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
			$components: '/src/components',
			$routes: '/src/routes'
		}
	}
};

export default config;
