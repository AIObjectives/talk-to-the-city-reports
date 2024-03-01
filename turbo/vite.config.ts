import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    // host: '0.0.0.0', // uncomment for local mobile testing
    hmr: {
      overlay: false
    }
  },
  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: path.resolve('./src/components'),
      $routes: '/src/routes',
      $test: '/src/test'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
};

export default config;
