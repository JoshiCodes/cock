import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { stats } from '../facts.js';
import { h, png, size, svgImage } from '../og/render.server.js';

/**
 * The site-wide link preview, used by every page without one of its own.
 * Rendered at build time so the component count comes from the catalog, like
 * every other number on the site, instead of being painted into a PNG by hand.
 */
export const prerender = true;

// The dark theme's colours.
const colours = {
	bg: '#121014',
	glow: '#3a1f45',
	fg: '#f3f1f4',
	muted: '#a7a1ab',
	accent: '#c58ce0'
};

// The logo and wordmark together, as the brand folder ships it for dark backgrounds.
const lockup = readFileSync(join(process.cwd(), 'static/brand/logo-dark.svg'), 'utf8');

export async function GET() {
	const tree = h(
		'div',
		{
			...size,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			boxSizing: 'border-box',
			padding: '0 96px',
			backgroundColor: colours.bg,
			backgroundImage: `radial-gradient(circle at 25% 10%, ${colours.glow}, ${colours.bg} 70%)`,
			color: colours.fg,
			fontFamily: 'Hanken Grotesk'
		},
		svgImage(lockup, 650, 180),
		h(
			'div',
			{
				fontSize: 44,
				fontWeight: 600,
				letterSpacing: '-0.01em',
				marginTop: '64px'
			},
			'The Svelte 5 and Tailwind 4 component kit.'
		),
		h(
			'div',
			{ fontSize: 30, color: colours.muted, marginTop: '20px' },
			`${stats.components} components · dark mode · themes from three colours`
		),
		h('div', { fontSize: 26, color: colours.accent, marginTop: '48px' }, 'cock.joshicodes.de')
	);

	return png(tree);
}
