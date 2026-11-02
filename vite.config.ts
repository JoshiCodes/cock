import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			// The docs examples import the package by its published name, so the
			// code shown under a demo is the code a reader would paste. In here it
			// has to point back at the sources.
			'@joshicodes/cock/theme.css': fileURLToPath(
				new URL('./src/lib/styles/theme.css', import.meta.url)
			),
			'@joshicodes/cock': fileURLToPath(new URL('./src/lib/index.ts', import.meta.url))
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// The preview site runs as a Node server in Docker; see Dockerfile.
			adapter: adapter(),

			prerender: {
				handleMissingId: ({ path, message }) => {
					// The navbar demos route through #flock, #coops and so on, which
					// are not anchors on the page and are not meant to be.
					if (path === '/components/navbar') return;
					throw new Error(message);
				}
			}
		})
	]
});
