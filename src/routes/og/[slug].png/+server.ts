import { error } from '@sveltejs/kit';
import { bySlug, categoryOf, components } from '../../components/catalog.js';
import { png, preview } from '../render.server.js';

/**
 * A link preview per component page, in the same layout as the site-wide one.
 * Rendered once at build time; nothing here runs on the server.
 */
export const prerender = true;

export const entries = () => components.map((entry) => ({ slug: entry.slug }));

export async function GET({ params }) {
	const meta = bySlug.get(params.slug);
	if (!meta) error(404, `There is no component called ${params.slug}.`);

	return png(
		preview({
			eyebrow: categoryOf(meta.category).title,
			title: meta.name,
			titleSize: 104,
			subtitle: meta.summary.replaceAll('`', ''),
			url: `cock.joshicodes.de/components/${meta.slug}`
		})
	);
}
