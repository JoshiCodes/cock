import { components, categoryOf } from '../components/catalog.js';
import { componentDocs, type PropDoc } from '../components/props.server.js';
import { site } from '../seo.js';

export const prerender = true;

function table(rows: PropDoc[]): string {
	const head = '| Name | Type | Default | Notes |\n| --- | --- | --- | --- |';
	const body = rows.map((row) => {
		const notes = [
			row.required ? 'required' : '',
			row.bindable ? 'bindable' : '',
			row.description ?? ''
		]
			.filter(Boolean)
			.join('. ');
		return `| \`${row.name}\` | \`${row.type}\` | ${row.default ? `\`${row.default}\`` : '—'} | ${notes || '—'} |`;
	});
	return [head, ...body].join('\n');
}

/** The whole API in one file, for pasting into a model's context. */
export function GET() {
	const parts: string[] = [
		`# ${site.name} — complete reference`,
		'',
		`> ${site.description}`,
		'',
		'Install: `npm install @joshicodes/cock` (also bun, pnpm, yarn).',
		'',
		'```css',
		'/* src/app.css */',
		"@import 'tailwindcss';",
		"@import '@joshicodes/cock/theme.css';",
		'```',
		'',
		'```ts',
		'// src/hooks.server.ts — applies the stored theme before the first paint',
		"export { themeHandle as handle } from '@joshicodes/cock';",
		'```',
		'',
		'## Theming',
		'',
		'Set three custom properties; the rest is derived with `color-mix`:',
		'`--ck-bg`, `--ck-fg`, `--ck-accent` (plus `--ck-accent-hover` and `--ck-accent-fg`',
		'when you use a custom accent). Derived tokens: `--ck-canvas`, `--ck-surface`,',
		'`--ck-muted`, `--ck-border`, `--ck-border-strong`, `--ck-fg-muted`, `--ck-fg-subtle`,',
		'`--ck-accent-soft`, `--ck-ring`. Each one reaches Tailwind as a utility, e.g. `bg-surface`.',
		'Other knobs: `--ck-tint`, `--ck-radius-scale`, `--ck-font-sans`, `--ck-font-mono`.',
		'Put `data-ck-theme="dark"` on any element to theme only that subtree.',
		'',
		'Runtime: `theme.mode`, `theme.toggle()`, `theme.accent`, `theme.setToken(name, value, scheme?)`,',
		'`theme.setSharedToken()`, `theme.clearTokens()`, `theme.resolved`, `theme.revision`.',
		'',
		'Every component accepts `class`, merged with tailwind-merge so your utility wins.',
		''
	];

	for (const meta of components) {
		const docs = [meta.name, ...(meta.parts ?? [])]
			.map((name) => componentDocs[name])
			.filter((doc) => doc !== undefined);

		parts.push(
			`## ${meta.name}`,
			'',
			`${meta.description ?? meta.summary}`,
			'',
			`Category: ${categoryOf(meta.category).title}. Docs: ${site.url}/components/${meta.slug}`,
			'',
			'```svelte',
			`import { ${[meta.name, ...(meta.parts ?? []), ...(meta.exports ?? [])].join(', ')} } from '@joshicodes/cock';`,
			'```',
			''
		);

		if (meta.setup) {
			parts.push(
				`Setup, once in \`${meta.setup.file}\`:`,
				'',
				'```svelte',
				meta.setup.code,
				'```',
				''
			);
		}

		for (const doc of docs) {
			if (docs.length > 1) parts.push(`### <${doc.name}>`, '');

			for (const [kind, label] of [
				['prop', 'Props'],
				['snippet', 'Snippets'],
				['event', 'Events']
			] as const) {
				const rows = doc.props.filter((prop) => prop.kind === kind);
				if (rows.length) parts.push(`**${label}**`, '', table(rows), '');
			}

			if (doc.forwards) {
				parts.push(`Remaining attributes are forwarded (\`${doc.forwards}\`).`, '');
			}
		}

		if (meta.keyboard?.length) {
			parts.push(
				'**Keyboard**',
				'',
				...meta.keyboard.map(([keys, what]) => `- \`${keys}\`: ${what}`),
				''
			);
		}
		if (meta.notes?.length) {
			parts.push('**Behavior**', '', ...meta.notes.map((note) => `- ${note}`), '');
		}
	}

	return new Response(parts.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
