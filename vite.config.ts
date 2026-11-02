import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { themeScript } from './src/lib/state/theme-script.js';

// The no-flash theme script is injected by a hook, not by SvelteKit, so its
// hash has to be allowed by hand. It follows the script, so it cannot go stale.
const themeScriptHash =
	`sha256-${createHash('sha256').update(themeScript).digest('base64')}` as const;

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
	// A native binary, used only to prerender the link previews; it cannot be bundled.
	ssr: { external: ['@resvg/resvg-js'] },
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

			// Hashes every inline script SvelteKit writes. Prerendered pages get the
			// policy as a <meta> tag; server.js adds the parts a meta tag cannot carry.
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'script-src': ['self', themeScriptHash],
					// Svelte transitions and style: directives write inline styles.
					'style-src': ['self', 'unsafe-inline'],
					'img-src': ['self', 'data:'],
					// Vite inlines small font files as data: URIs.
					'font-src': ['self', 'data:'],
					'connect-src': ['self'],
					'object-src': ['none'],
					'base-uri': ['self'],
					'form-action': ['self'],
					// Left out of <meta> by SvelteKit, where browsers ignore it; server.js covers those.
					'frame-ancestors': ['none']
				}
			},

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
