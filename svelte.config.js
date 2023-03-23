import adapter from '@sveltejs/adapter-auto';
import {vitePreprocess} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        alias: {
            "$src": "./src/",
            "$cmp": "./src/components",
            "$routes": "./src/routes/",
            "$models": "./src/lib/models/",
            "$config": "./src/lib/config/",

            // Files in the public directory are served at the root path
            "$root": "./public/"
        }
    }
};

export default config;
