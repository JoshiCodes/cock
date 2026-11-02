import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { bySlug, categoryOf, components } from '../../components/catalog.js';

/**
 * A link preview per component page: the name, its one-line summary and the
 * logo, 1200×630. Rendered once at build time; nothing here runs on the server.
 */
export const prerender = true;

export const entries = () => components.map((entry) => ({ slug: entry.slug }));

const fonts = join(process.cwd(), 'node_modules/@fontsource/hanken-grotesk/files');
const regular = readFileSync(join(fonts, 'hanken-grotesk-latin-400-normal.woff'));
const semibold = readFileSync(join(fonts, 'hanken-grotesk-latin-600-normal.woff'));

// The light theme's colours, as the default accent sets them.
const colours = {
	bg: '#faf9fa',
	fg: '#171717',
	muted: '#6b6670',
	border: '#e7e3e8',
	accent: '#7a3dbd'
};

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${colours.accent}"/><g fill="#fff"><ellipse cx="11.7" cy="8.4" rx="1.9" ry="2.9" transform="rotate(-28 11.7 8.4)"/><ellipse cx="15.5" cy="6.7" rx="2.1" ry="3.3" transform="rotate(-6 15.5 6.7)"/><ellipse cx="19.2" cy="8" rx="1.8" ry="2.7" transform="rotate(18 19.2 8)"/><path d="M20.6 11.4 27.8 14.5 20.6 16.6Z"/><ellipse cx="22.7" cy="25.3" rx="1.6" ry="2.3" transform="rotate(-16 22.7 25.3)"/><circle cx="17.6" cy="15.7" r="1.3"/></g><path d="M21.6 13.6A7.2 7.2 0 1 0 21.6 22.6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;

type Node = { type: string; props: Record<string, unknown> };

/** The element shape satori reads, without pulling React in for JSX. */
function h(type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node {
	return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}

export async function GET({ params }) {
	const meta = bySlug.get(params.slug);
	if (!meta) error(404, `There is no component called ${params.slug}.`);

	const tree = h(
		'div',
		{
			width: 1200,
			height: 630,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			boxSizing: 'border-box',
			padding: '64px 80px 56px',
			backgroundColor: colours.bg,
			backgroundImage: `linear-gradient(to bottom, ${colours.accent} 12px, ${colours.bg} 12px)`,
			color: colours.fg,
			fontFamily: 'Hanken Grotesk'
		},
		h(
			'div',
			{ display: 'flex', alignItems: 'center', gap: '20px' },
			{
				type: 'img',
				props: {
					src: `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`,
					width: 64,
					height: 64
				}
			},
			h('div', { fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }, 'cock')
		),
		h(
			'div',
			{ display: 'flex', flexDirection: 'column', gap: '24px' },
			h(
				'div',
				{ fontSize: 30, color: colours.accent, fontWeight: 600 },
				categoryOf(meta.category).title
			),
			h(
				'div',
				{ fontSize: 96, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 },
				meta.name
			),
			h(
				'div',
				{ fontSize: 36, color: colours.muted, lineHeight: 1.35, maxWidth: '980px' },
				meta.summary.replaceAll('`', '')
			)
		),
		h(
			'div',
			{
				display: 'flex',
				justifyContent: 'space-between',
				borderTop: `2px solid ${colours.border}`,
				paddingTop: '28px',
				fontSize: 26,
				color: colours.muted
			},
			h('div', {}, 'Svelte 5 · Tailwind 4'),
			h('div', {}, `cock.joshicodes.de/components/${meta.slug}`)
		)
	);

	const svg = await satori(tree as never, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Hanken Grotesk', data: regular, weight: 400, style: 'normal' },
			{ name: 'Hanken Grotesk', data: semibold, weight: 600, style: 'normal' }
		]
	});
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

	return new Response(new Uint8Array(png), {
		headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' }
	});
}
