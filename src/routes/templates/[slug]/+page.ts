import { error } from '@sveltejs/kit';
import { bySlug, templates } from '../registry.js';

/** Tells the prerenderer about every template page up front. */
export const entries = () => templates.map((template) => ({ slug: template.slug }));

export function load({ params }) {
	if (!bySlug.has(params.slug)) error(404, `There is no template called ${params.slug}.`);
	return { slug: params.slug };
}
