import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

/** What the link previews share: the fonts, the logo and the PNG step. */

const fonts = join(process.cwd(), 'node_modules/@fontsource/hanken-grotesk/files');
const regular = readFileSync(join(fonts, 'hanken-grotesk-latin-400-normal.woff'));
const semibold = readFileSync(join(fonts, 'hanken-grotesk-latin-600-normal.woff'));

export const size = { width: 1200, height: 630 };

export type Node = { type: string; props: Record<string, unknown> };

/** The element shape satori reads, without pulling React in for JSX. */
export function h(
	type: string,
	style: Record<string, unknown>,
	...children: (Node | string)[]
): Node {
	return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}

/** An `<img>` of an SVG string, which satori draws like any other image. */
export function svgImage(svg: string, width: number, height: number): Node {
	return {
		type: 'img',
		props: {
			src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
			width,
			height
		}
	};
}

// The dark theme's colors, which every preview uses.
const colors = {
	bg: '#121014',
	glow: '#3a1f45',
	fg: '#f3f1f4',
	muted: '#a7a1ab',
	border: '#2c2730',
	accent: '#c58ce0'
};

// The logo and wordmark together, as the brand folder ships it for dark backgrounds.
const lockup = readFileSync(join(process.cwd(), 'static/brand/logo-dark.svg'), 'utf8');

export interface Preview {
	/** A short line above the title, in the accent color. */
	eyebrow?: string;
	title: string;
	/** Smaller for a sentence, larger for a single name. */
	titleSize: number;
	subtitle: string;
	/** Shown without the protocol. */
	url: string;
}

/**
 * The one layout every link preview shares: lockup on top, the page's own
 * words in the middle, the address at the bottom. Only the words change.
 */
export function preview({ eyebrow, title, titleSize, subtitle, url }: Preview): Node {
	return h(
		'div',
		{
			...size,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			boxSizing: 'border-box',
			padding: '64px 80px 56px',
			backgroundColor: colors.bg,
			backgroundImage: `radial-gradient(circle at 25% 10%, ${colors.glow}, ${colors.bg} 70%)`,
			color: colors.fg,
			fontFamily: 'Hanken Grotesk'
		},
		svgImage(lockup, 252, 70),
		h(
			'div',
			{ display: 'flex', flexDirection: 'column', gap: '24px' },
			...(eyebrow
				? [h('div', { fontSize: 30, fontWeight: 600, color: colors.accent }, eyebrow)]
				: []),
			h(
				'div',
				{ fontSize: titleSize, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05 },
				title
			),
			h(
				'div',
				{ fontSize: 34, color: colors.muted, lineHeight: 1.35, maxWidth: '1000px' },
				subtitle
			)
		),
		h(
			'div',
			{
				display: 'flex',
				justifyContent: 'space-between',
				borderTop: `2px solid ${colors.border}`,
				paddingTop: '28px',
				fontSize: 26,
				color: colors.muted
			},
			h('div', {}, 'Svelte 5 · Tailwind 4'),
			h('div', { color: colors.accent }, url)
		)
	);
}

/** Renders a tree to a 1200×630 PNG response. */
export async function png(tree: Node): Promise<Response> {
	const svg = await satori(tree as never, {
		...size,
		fonts: [
			{ name: 'Hanken Grotesk', data: regular, weight: 400, style: 'normal' },
			{ name: 'Hanken Grotesk', data: semibold, weight: 600, style: 'normal' }
		]
	});
	const image = new Resvg(svg, { fitTo: { mode: 'width', value: size.width } }).render().asPng();

	return new Response(new Uint8Array(image), {
		headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' }
	});
}
