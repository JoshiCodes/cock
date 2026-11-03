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

/** The square mark, in whichever accent the preview uses. */
export function logo(accent: string): string {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${accent}"/><g fill="#fff"><ellipse cx="11.7" cy="8.4" rx="1.9" ry="2.9" transform="rotate(-28 11.7 8.4)"/><ellipse cx="15.5" cy="6.7" rx="2.1" ry="3.3" transform="rotate(-6 15.5 6.7)"/><ellipse cx="19.2" cy="8" rx="1.8" ry="2.7" transform="rotate(18 19.2 8)"/><path d="M20.6 11.4 27.8 14.5 20.6 16.6Z"/><ellipse cx="22.7" cy="25.3" rx="1.6" ry="2.3" transform="rotate(-16 22.7 25.3)"/><circle cx="17.6" cy="15.7" r="1.3"/></g><path d="M21.6 13.6A7.2 7.2 0 1 0 21.6 22.6" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`;
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
