import { error } from '@sveltejs/kit';
import { bySlug, categoryOf, components } from '../../components/catalog.js';
import { h, logo, png, size, svgImage } from '../render.server.js';

/**
 * A link preview per component page: the name, its one-line summary and the
 * logo, 1200×630. Rendered once at build time; nothing here runs on the server.
 */
export const prerender = true;

export const entries = () => components.map((entry) => ({ slug: entry.slug }));

// The light theme's colours, as the default accent sets them.
const colours = {
	bg: '#faf9fa',
	fg: '#171717',
	muted: '#6b6670',
	border: '#e7e3e8',
	accent: '#7a3dbd'
};

export async function GET({ params }) {
	const meta = bySlug.get(params.slug);
	if (!meta) error(404, `There is no component called ${params.slug}.`);

	const tree = h(
		'div',
		{
			...size,
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
			svgImage(logo(colours.accent), 64, 64),
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

	return png(tree);
}
