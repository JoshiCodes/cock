import { stats } from '../facts.js';
import { png, preview } from '../og/render.server.js';

/**
 * The site-wide link preview, used by every page without one of its own.
 * Rendered at build time so the component count comes from the catalog, like
 * every other number on the site, instead of being painted into a PNG by hand.
 */
export const prerender = true;

export async function GET() {
	return png(
		preview({
			title: 'The Svelte 5 and Tailwind 4 component kit.',
			titleSize: 72,
			subtitle: `${stats.components} components · dark mode · themes from three colors`,
			url: 'cock.joshicodes.de'
		})
	);
}
