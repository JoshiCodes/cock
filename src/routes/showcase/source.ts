/**
 * Pulls the markup of every <Demo> out of a section's own source, so the code
 * shown under a demo is always the code that renders it.
 */

export const DEMO_SOURCE = 'showcase:demo-source';

export interface DemoSource {
	/** Hands out the next demo body, in source order. */
	take: () => string | undefined;
}

/** Index just past the `>` that closes the tag starting at `from`, skipping quotes and braces. */
function endOfTag(text: string, from: number): number {
	let depth = 0;
	let quote: string | null = null;

	for (let i = from; i < text.length; i++) {
		const char = text[i];
		if (quote) {
			if (char === quote && text[i - 1] !== '\\') quote = null;
		} else if (char === '"' || char === "'" || char === '`') {
			quote = char;
		} else if (char === '{') {
			depth++;
		} else if (char === '}') {
			depth--;
		} else if (char === '>' && depth === 0) {
			return i + 1;
		}
	}
	return text.length;
}

function dedent(block: string): string {
	const lines = block.replace(/^\n+|\s+$/g, '').split('\n');
	const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\t*/)![0].length);
	const strip = Math.min(...indents);

	return lines
		.map((line) => line.slice(strip).replace(/^\t+/, (tabs) => '  '.repeat(tabs.length)))
		.join('\n');
}

export function demoBodies(source: string): string[] {
	const bodies: string[] = [];
	let cursor = 0;

	while (true) {
		const start = source.indexOf('<Demo', cursor);
		if (start === -1) break;

		const open = endOfTag(source, start);
		const selfClosing = source[open - 2] === '/';
		const close = selfClosing ? open : source.indexOf('</Demo>', open);
		if (close === -1) break;

		bodies.push(selfClosing ? '' : dedent(source.slice(open, close)));
		cursor = close + 1;
	}

	return bodies;
}
