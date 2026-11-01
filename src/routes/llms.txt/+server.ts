import { grouped } from '../components/catalog.js';
import { site } from '../seo.js';

export const prerender = true;

/** https://llmstxt.org — a map of the documentation for language models. */
export function GET() {
	const section = (title: string, lines: string[]) => `## ${title}\n\n${lines.join('\n')}\n`;

	const body = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		'Svelte 5 and Tailwind 4 only. Install with `npm install @joshicodes/cock`.',
		'Theming is three CSS variables (`--ck-bg`, `--ck-fg`, `--ck-accent`); every other',
		'colour is mixed from them with `color-mix`, so overriding one re-skins the rest.',
		'',
		section('Docs', [
			`- [Getting started](${site.url}/docs/getting-started): install, Tailwind setup, and the hook that prevents a dark-mode flash`,
			`- [Theming](${site.url}/docs/theming): the token system, scoped themes and the runtime API`,
			`- [Helpers and actions](${site.url}/docs/utilities): cn, uid, lockScroll, confetti, hotkeys and the four actions`,
			`- [Types](${site.url}/docs/types): every exported type, written out`,
			`- [How it compares](${site.url}/docs/comparison): next to shadcn-svelte, Bits UI and Skeleton, with measured bundle sizes`,
			`- [Component index](${site.url}/components): all components with examples and props`,
			`- [Theme generator](${site.url}/themes): generate a palette and copy the CSS`,
			`- [Full API as one file](${site.url}/llms-full.txt): every component, prop, default and keyboard shortcut`
		]),
		...grouped.map((group) =>
			section(
				group.category.title,
				group.items.map(
					(item) => `- [${item.name}](${site.url}/components/${item.slug}): ${item.summary}`
				)
			)
		)
	].join('\n');

	return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
