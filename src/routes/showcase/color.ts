/** Colour helpers for the control panel. Browser only. */

let context: CanvasRenderingContext2D | null = null;

function canvas(): CanvasRenderingContext2D | null {
	if (context) return context;
	const element = document.createElement('canvas');
	element.width = element.height = 1;
	context = element.getContext('2d', { willReadFrequently: true });
	return context;
}

/**
 * Resolve any CSS colour to `#rrggbb`.
 *
 * Reading `getComputedStyle().color` is not enough: browsers hand back
 * `oklch(...)` unchanged, and parsing the numbers out of that gives nonsense.
 * Painting one pixel and reading it back always lands in sRGB.
 */
export function toHex(value: string): string {
	const ctx = canvas();
	if (!ctx) return '#000000';

	ctx.fillStyle = '#000000';
	ctx.fillStyle = value;
	ctx.clearRect(0, 0, 1, 1);
	ctx.fillRect(0, 0, 1, 1);

	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return '#' + [r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('');
}

/** Read a custom property off <html> and resolve it to hex. */
export function tokenHex(name: string): string {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	return raw ? toHex(raw) : '#000000';
}

function channels(hex: string): [number, number, number] {
	const value = hex.replace('#', '');
	return [
		parseInt(value.slice(0, 2), 16),
		parseInt(value.slice(2, 4), 16),
		parseInt(value.slice(4, 6), 16)
	];
}

/** Perceived brightness, 0 to 1. */
export function luminance(hex: string): number {
	const [r, g, b] = channels(hex).map((channel) => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Lighten (positive) or darken (negative) by a percentage. */
export function shift(hex: string, percent: number): string {
	const target = percent > 0 ? 255 : 0;
	const ratio = Math.abs(percent) / 100;
	return (
		'#' +
		channels(hex)
			.map((channel) => Math.round(channel + (target - channel) * ratio))
			.map((channel) => channel.toString(16).padStart(2, '0'))
			.join('')
	);
}
