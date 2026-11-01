import type { Component } from 'svelte';

/**
 * Every demo on a component page is a real file under `examples/<slug>/`.
 * The page renders the module and shows the file, so the code below a demo is
 * the code that produced it.
 *
 * Name files `<nn>-<kebab-case>.svelte`; the number orders them and the rest
 * becomes the heading. An opening HTML comment is used as the caption and left
 * out of the displayed source.
 */

export interface Example {
	id: string;
	title: string;
	description?: string;
	component: Component;
	source: string;
}

const modules = import.meta.glob('./examples/*/*.svelte', {
	eager: true,
	import: 'default'
}) as Record<string, Component>;

const sources = import.meta.glob('./examples/*/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function titleOf(file: string): string {
	const words = file.replace(/^\d+-/, '').replace('.svelte', '').replace(/-/g, ' ');
	return words.charAt(0).toUpperCase() + words.slice(1);
}

function split(raw: string): { description?: string; source: string } {
	const source = raw.trim();
	if (!source.startsWith('<!--')) return { source };

	const end = source.indexOf('-->');
	return {
		description: source.slice(4, end).trim(),
		source: source.slice(end + 3).trim()
	};
}

const bySlug = new Map<string, Example[]>();

for (const [path, component] of Object.entries(modules)) {
	const [, slug, file] = path.split('/').slice(-3);
	const { description, source } = split(sources[path] ?? '');

	const list = bySlug.get(slug) ?? [];
	list.push({
		id: file.replace('.svelte', ''),
		title: titleOf(file),
		description,
		component,
		source
	});
	bySlug.set(slug, list);
}

for (const list of bySlug.values()) list.sort((a, b) => a.id.localeCompare(b.id));

export function examplesFor(slug: string): Example[] {
	return bySlug.get(slug) ?? [];
}

/** Slugs that have at least one example, for a build-time sanity check. */
export const coveredSlugs = [...bySlug.keys()];
