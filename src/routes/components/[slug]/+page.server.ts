import { error } from '@sveltejs/kit';
import { bySlug, components } from '../catalog.js';
import { componentDocs } from '../props.server.js';
import { typeNames } from '../../docs/types/extract.server.js';
import { lastmod } from '../../lastmod.server.js';

/** Tells the prerenderer about every component page up front. */
export const entries = () => components.map((entry) => ({ slug: entry.slug }));

export function load({ params }) {
	const meta = bySlug.get(params.slug);
	if (!meta) error(404, `There is no component called ${params.slug}.`);

	// The page documents the component plus any parts that belong to it.
	const docs = [meta.name, ...(meta.parts ?? [])]
		.map((name) => componentDocs[name])
		.filter((doc) => doc !== undefined);

	// The same date the sitemap gives, for the article's dateModified.
	const modified = lastmod(`/components/${meta.slug}`);

	return { meta, docs, typeNames, modified };
}
