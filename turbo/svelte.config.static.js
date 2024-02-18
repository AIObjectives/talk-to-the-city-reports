import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      strict: false,
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    alias: {
      $lib: 'src/lib',
      $components: 'src/components',
      $routes: 'src/routes'
    },
    prerender: {
      entries: ['/static-report'],
      crawl: false,
      origin: 'http://sveltekit-prerender',
      concurrency: 3,
      handleHttpError: ({ path, referrer, message }) => {
        console.log(path);
        if (path.indexOf('/permalink') !== -1 || path.indexOf('/report/') !== -1) {
          return;
        }

        // otherwise fail the build
        throw new Error(message);
      }
    },
    version: {
      name: Date.now().toString()
    },
    paths: {
      base: process.env.BN_SVELTE_BASE
    }
  }
};

export default config;
