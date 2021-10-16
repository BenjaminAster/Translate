// #

import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

import basePath from "./base-path.js";

const appDir = "_";

export default {
	preprocess: sveltePreprocess(),
	kit: {
		appDir: appDir,
		adapter: adapter({
			pages: "../",
		}),
		paths: {
			base: basePath,
		},
		prerender: {
			crawl: false,
		},
		trailingSlash: "always",
		vite: {
			// mode: "development",
			build: {
				sourcemap: true,
				rollupOptions: {
					output: {
					},
					external: [
					],
				},
			},
		},
	},
};


/* 
 * Versions: 
 * svelte@3.42.1 
 * svelte-hmr@0.14.7 
 * svelte-preprocess@4.7.4 
 * @sveltejs/adapter-static@1.0.0-next.13 
 * @sveltejs/kit@1.0.0-next.132 
 * @sveltejs/vite-plugin-svelte@1.0.0-next.15 
 */

// "scripts": {
// 	"dev": "svelte-kit dev",
// 	"build": "svelte-kit build",
// 	"preview": "svelte-kit preview",
// 	"check": "svelte-check --tsconfig ./tsconfig.json",
// 	"check:watch": "svelte-check --tsconfig ./tsconfig.json --watch"
// },