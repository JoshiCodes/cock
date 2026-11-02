/**
 * OKLCH maths for the colour picker: parsing, formatting and the trip to and
 * from sRGB. Formulas from Björn Ottosson's OKLab, which is what browsers use.
 */

/** Lightness 0–1, chroma 0–~0.37, hue in degrees. */
export type Oklch = [l: number, c: number, h: number];

function toLinearRgb([l, c, h]: Oklch): [number, number, number] {
	const rad = (h * Math.PI) / 180;
	const a = c * Math.cos(rad);
	const b = c * Math.sin(rad);

	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

	return [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
	];
}

function fromLinearRgb([r, g, b]: [number, number, number]): Oklch {
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

	const c = Math.hypot(A, B);
	const h = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
	// Greys have no hue; 0 is as good as any and keeps the output stable.
	return [L, c < 0.0005 ? 0 : c, c < 0.0005 ? 0 : h];
}

const encode = (channel: number) => {
	const c = Math.min(1, Math.max(0, channel));
	return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

const decode = (channel: number) =>
	channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** Whether the colour exists in sRGB, the gamut almost every screen can show. */
export function inGamut(color: Oklch): boolean {
	return toLinearRgb(color).every((channel) => channel >= -0.0005 && channel <= 1.0005);
}

/** Lower chroma until the colour fits in sRGB, instead of letting the browser clip it. */
export function fitToGamut([l, c, h]: Oklch): Oklch {
	let chroma = c;
	while (chroma > 0 && !inGamut([l, chroma, h])) chroma -= 0.002;
	return [l, Math.max(0, chroma), h];
}

/** sRGB channels from 0 to 255, clamped when the colour is out of gamut. */
export function oklchToRgb(color: Oklch): [number, number, number] {
	const [r, g, b] = toLinearRgb(color).map((channel) => Math.round(encode(channel) * 255));
	return [r, g, b];
}

export function oklchToHex(color: Oklch): string {
	return (
		'#' +
		oklchToRgb(color)
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
	);
}

/** `oklch(0.62 0.17 316)`, rounded to what the eye can tell apart. */
export function formatOklch([l, c, h]: Oklch): string {
	const chroma = +c.toFixed(3);
	return `oklch(${+l.toFixed(3)} ${chroma} ${chroma === 0 ? 0 : +h.toFixed(1)})`;
}

/**
 * Reads `oklch(…)` in any of its spellings, `#rgb` and `#rrggbb`. Returns
 * null for anything else rather than guessing.
 */
export function parseColor(input: string): Oklch | null {
	const text = input.trim().toLowerCase();

	const oklch =
		/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/.exec(
			text
		);
	if (oklch) {
		const l = parseFloat(oklch[1]) / (oklch[2] ? 100 : 1);
		// In CSS, 100% chroma is 0.4.
		const c = parseFloat(oklch[3]) * (oklch[4] ? 0.004 : 1);
		const h = parseFloat(oklch[5]) % 360;
		if ([l, c, h].some(Number.isNaN)) return null;
		return [Math.min(1, Math.max(0, l)), Math.max(0, c), h];
	}

	const hex = /^#?([\da-f]{3}|[\da-f]{6})$/.exec(text);
	if (hex) {
		const digits = hex[1].length === 3 ? [...hex[1]].map((d) => d + d).join('') : hex[1];
		const channels = [0, 2, 4].map((i) => decode(parseInt(digits.slice(i, i + 2), 16) / 255));
		return fromLinearRgb(channels as [number, number, number]);
	}

	return null;
}
