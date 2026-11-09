import type { Component } from 'svelte';

export type TemplateOption =
	| { name: string; label: string; type: 'boolean'; default: boolean }
	| {
			name: string;
			label: string;
			type: 'select';
			default: string;
			options: { value: string; label: string }[];
	  }
	| { name: string; label: string; type: 'text'; default: string; placeholder?: string };

export interface TemplateMeta {
	options?: TemplateOption[];
	/** Minimum height of the preview, in pixels. */
	height?: number;
	/** Option values for the gallery card, e.g. to keep a moving background still. */
	thumbnail?: Record<string, string | boolean>;
}

interface TemplateModule {
	default: Component;
	meta?: TemplateMeta;
}

export interface Template {
	slug: string;
	title: string;
	category: string;
	description?: string;
	/** Imports from `@joshicodes/cock`, listed under the preview. */
	uses: string[];
	component: Component;
	source: string;
	meta: TemplateMeta;
}

export const categories: { slug: string; name: string; blurb: string }[] = [
	{
		slug: 'authentication',
		name: 'Authentication',
		blurb: 'Sign in, sign up and everything around the front door.'
	},
	{ slug: 'marketing', name: 'Marketing', blurb: 'Heroes, pricing and the pages that sell.' },
	{ slug: 'application', name: 'Application', blurb: 'Screens from inside a working product.' },
	{ slug: 'forms', name: 'Forms', blurb: 'Longer forms, laid out and labelled.' }
];

export const categoryNames: Record<string, string> = Object.fromEntries(
	categories.map((category) => [category.slug, category.name])
);

const modules = import.meta.glob<TemplateModule>('./library/*/*.svelte', { eager: true });
const sources = import.meta.glob<string>('./library/*/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function slugOf(path: string): string {
	return path.split('/').pop()!.replace(/^\d+-/, '').replace('.svelte', '');
}

function titleOf(slug: string): string {
	const words = slug.replace(/-/g, ' ').replace(/\b(faq|cta)\b/g, (word) => word.toUpperCase());
	return words.charAt(0).toUpperCase() + words.slice(1);
}

function contentOf(raw: string): { description?: string; source: string } {
	let source = raw.trim();
	let description: string | undefined;

	if (source.startsWith('<!--')) {
		const end = source.indexOf('-->');
		if (end !== -1) {
			description = source.slice(4, end).trim();
			source = source.slice(end + 3).trim();
		}
	}

	source = source.replace(/<script\b(?=[^>]*\bmodule\b)[^>]*>[\s\S]*?<\/script>/i, '').trim();
	return { description, source };
}

function usesOf(source: string): string[] {
	const match = source.match(/import\s*\{([^}]*)\}\s*from\s*'@joshicodes\/cock'/);
	if (!match) return [];
	return match[1]
		.split(',')
		.map((name) => name.trim())
		.filter((name) => /^[A-Z]/.test(name));
}

const order = categories.map((category) => category.slug);

export const templates: Template[] = Object.entries(modules)
	.map(([path, module]) => {
		const category = path.split('/').at(-2)!;
		const slug = slugOf(path);
		const { description, source } = contentOf(sources[path] ?? '');

		return {
			slug,
			title: titleOf(slug),
			category,
			description,
			uses: usesOf(source),
			component: module.default,
			source,
			meta: module.meta ?? {},
			file: path.split('/').pop()!
		};
	})
	.sort(
		(a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.file.localeCompare(b.file)
	)
	.map(({ file: _file, ...template }) => template);

export const bySlug = new Map(templates.map((template) => [template.slug, template]));
