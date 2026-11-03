/**
 * Random but coherent themes for cock.
 *
 * Everything is picked in OKLCH, where lightness is perceptual: an accent at
 * L 0.55 looks equally strong whatever its hue, which is what keeps random
 * themes from coming out muddy or garish.
 */

export type Oklch = [l: number, c: number, h: number];

export type Mood = 'neutral' | 'tinted' | 'cool' | 'warm' | 'split';

export interface Scheme {
	bg: Oklch;
	fg: Oklch;
	accent: Oklch;
	accentHover: Oklch;
	accentFg: Oklch;
	/** Percent of accent mixed into the neutrals. */
	tint: number;
}

export interface Theme {
	name: string;
	hue: number;
	mood: Mood;
	radius: number;
	light: Scheme;
	dark: Scheme;
}

export interface Locks {
	accent: boolean;
	background: boolean;
	shape: boolean;
}

/* -- color math --------------------------------------------------------- */

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

function inGamut(color: Oklch): boolean {
	return toLinearRgb(color).every((channel) => channel >= -0.0005 && channel <= 1.0005);
}

/** Lower chroma until the color fits in sRGB, instead of letting the browser clip it. */
function fit([l, c, h]: Oklch): Oklch {
	let chroma = c;
	while (chroma > 0 && !inGamut([l, chroma, h])) chroma -= 0.004;
	return [l, Math.max(0, chroma), h];
}

function luminance(color: Oklch): number {
	const [r, g, b] = toLinearRgb(color).map((channel) => Math.min(1, Math.max(0, channel)));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: Oklch, b: Oklch): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

export function toHex(color: Oklch): string {
	return (
		'#' +
		toLinearRgb(color)
			.map((channel) => {
				const c = Math.min(1, Math.max(0, channel));
				const encoded = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
				return Math.round(encoded * 255)
					.toString(16)
					.padStart(2, '0');
			})
			.join('')
	);
}

export function css([l, c, h]: Oklch): string {
	const chroma = +c.toFixed(3);
	return `oklch(${+l.toFixed(3)} ${chroma} ${chroma === 0 ? 0 : +h.toFixed(1)})`;
}

/* -- generation ----------------------------------------------------------- */

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const wrap = (hue: number) => ((hue % 360) + 360) % 360;

const hueNames: [number, string][] = [
	[15, 'Crimson'],
	[40, 'Ember'],
	[62, 'Amber'],
	[85, 'Ochre'],
	[110, 'Citron'],
	[140, 'Moss'],
	[165, 'Jade'],
	[190, 'Teal'],
	[220, 'Lagoon'],
	[250, 'Cobalt'],
	[275, 'Indigo'],
	[300, 'Violet'],
	[325, 'Orchid'],
	[350, 'Rose'],
	[360, 'Crimson']
];

const moodNames: Record<Mood, string> = {
	neutral: 'Graphite',
	tinted: 'Dusk',
	cool: 'Frost',
	warm: 'Paper',
	split: 'Split'
};

// Roughly one theme in seven gets one of these instead. Picked from the hue, so a
// shared link always shows the same name.
const specialNames = [
	'Morning Glory',
	'Cocktail Hour',
	'Peacock',
	'Rooster at Dawn',
	'Big Bird',
	'Hard Candy',
	'Late Bloomer',
	'Stiff Breeze',
	'Long Weekend',
	'Handful'
];

function nameFor(hue: number, mood: Mood): string {
	if (Math.floor(hue * 100) % 7 === 0) return specialNames[Math.floor(hue) % specialNames.length];
	const hueName = hueNames.find(([limit]) => hue < limit)?.[1] ?? 'Crimson';
	return `${hueName} ${moodNames[mood]}`;
}

/** Hues around yellow only look saturated when they are light. */
const isYellowish = (hue: number) => hue > 65 && hue < 120;

function accents(hue: number, chroma: number) {
	const lightL = isYellowish(hue) ? random(0.74, 0.8) : random(0.5, 0.6);
	const lightAccent = fit([lightL, chroma, hue]);
	const darkAccent = fit([random(0.7, 0.79), Math.min(chroma, 0.17), hue]);

	const onAccent = (accent: Oklch): Oklch => {
		const light: Oklch = [0.99, 0, 0];
		const dark: Oklch = [0.2, 0.04, hue];
		return contrast(accent, light) >= contrast(accent, dark) ? light : dark;
	};

	return {
		light: {
			accent: lightAccent,
			accentHover: fit([lightAccent[0] - 0.05, lightAccent[1], hue]),
			accentFg: onAccent(lightAccent)
		},
		dark: {
			accent: darkAccent,
			accentHover: fit([Math.min(0.9, darkAccent[0] + 0.06), darkAccent[1] * 0.92, hue]),
			accentFg: onAccent(darkAccent)
		}
	};
}

function backgrounds(hue: number, mood: Mood) {
	const bgHue = {
		neutral: 0,
		tinted: hue,
		cool: 250,
		warm: 75,
		split: wrap(hue + 180)
	}[mood];
	const tone = (max: number) => (mood === 'neutral' ? 0 : random(max * 0.35, max));

	return {
		light: {
			bg: [random(0.965, 0.99), tone(0.014), bgHue] as Oklch,
			fg: [random(0.17, 0.24), tone(0.02), bgHue] as Oklch,
			tint: Math.round(random(0, 3) * 2) / 2
		},
		dark: {
			bg: [random(0.12, 0.185), tone(0.022), bgHue] as Oklch,
			fg: [random(0.92, 0.97), tone(0.012), bgHue] as Oklch,
			tint: Math.round(random(2, 10) * 2) / 2
		}
	};
}

const radii = [0, 0.5, 0.75, 1, 1, 1.25, 1.5, 2] as const;
const moods: Mood[] = ['neutral', 'tinted', 'tinted', 'cool', 'warm', 'split'];

export function generate(previous?: Theme, locks?: Locks): Theme {
	const keepAccent = previous && locks?.accent;
	const keepBackground = previous && locks?.background;
	const keepShape = previous && locks?.shape;

	const hue = keepAccent ? previous.hue : random(0, 360);
	const mood = keepBackground ? previous.mood : pick(moods);

	const accent = keepAccent
		? {
				light: pickAccent(previous.light),
				dark: pickAccent(previous.dark)
			}
		: accents(hue, random(0.12, 0.21));
	const background = keepBackground
		? {
				light: pickBackground(previous.light),
				dark: pickBackground(previous.dark)
			}
		: backgrounds(hue, mood);

	return {
		name: nameFor(hue, mood),
		hue,
		mood,
		radius: keepShape ? previous.radius : pick(radii),
		light: { ...background.light, ...accent.light },
		dark: { ...background.dark, ...accent.dark }
	};
}

function pickAccent({ accent, accentHover, accentFg }: Scheme) {
	return { accent, accentHover, accentFg };
}

function pickBackground({ bg, fg, tint }: Scheme) {
	return { bg, fg, tint };
}

/* -- output --------------------------------------------------------------- */

/** The custom properties for one scheme, ready for style attributes or CSS. */
export function tokens(scheme: Scheme, radius: number): Record<string, string> {
	return {
		'--ck-bg': css(scheme.bg),
		'--ck-fg': css(scheme.fg),
		'--ck-accent': css(scheme.accent),
		'--ck-accent-hover': css(scheme.accentHover),
		'--ck-accent-fg': css(scheme.accentFg),
		'--ck-tint': `${scheme.tint}%`,
		'--ck-radius-scale': String(radius)
	};
}

export function styleAttribute(scheme: Scheme, radius: number): string {
	return Object.entries(tokens(scheme, radius))
		.map(([name, value]) => `${name}: ${value}`)
		.join('; ');
}

export function stylesheet(theme: Theme): string {
	const block = (selector: string, scheme: Scheme, withRadius: boolean) => {
		const lines = Object.entries(tokens(scheme, theme.radius))
			.filter(([name]) => withRadius || name !== '--ck-radius-scale')
			.map(([name, value]) => `\t${name}: ${value};`);
		return `${selector} {\n${lines.join('\n')}\n}`;
	};

	return [
		`/* ${theme.name} — generated with cock */`,
		block(':root', theme.light, true),
		block('.dark', theme.dark, false)
	].join('\n\n');
}

/* -- sharing -------------------------------------------------------------- */

const round = (color: Oklch): Oklch => color.map((n) => +n.toFixed(4)) as Oklch;

export function encode(theme: Theme): string {
	const scheme = (s: Scheme) => [
		round(s.bg),
		round(s.fg),
		round(s.accent),
		round(s.accentHover),
		round(s.accentFg),
		s.tint
	];
	const json = JSON.stringify([
		+theme.hue.toFixed(2),
		theme.mood,
		theme.radius,
		scheme(theme.light),
		scheme(theme.dark)
	]);
	return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decode(code: string): Theme | null {
	try {
		const json = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
		const [hue, mood, radius, light, dark] = JSON.parse(json);
		const scheme = ([bg, fg, accent, accentHover, accentFg, tint]: unknown[]) =>
			({ bg, fg, accent, accentHover, accentFg, tint }) as Scheme;

		if (typeof hue !== 'number' || !(mood in moodNames) || typeof radius !== 'number') return null;

		return {
			name: nameFor(hue, mood),
			hue,
			mood,
			radius,
			light: scheme(light),
			dark: scheme(dark)
		};
	} catch {
		return null;
	}
}
