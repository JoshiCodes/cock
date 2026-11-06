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
	/** Percent of the foreground mixed into hairline borders. */
	border: number;
}

export interface Theme {
	name: string;
	hue: number;
	mood: Mood;
	radius: number;
	light: Scheme;
	dark: Scheme;
}

/** How deep the dark scheme goes. `black` is meant for OLED screens. */
export type Depth = 'charcoal' | 'deep' | 'black';
export type Vividness = 'muted' | 'balanced' | 'vivid';

export interface Preferences {
	depth: Depth;
	vividness: Vividness;
	/** `any` lets the dice pick. */
	mood: Mood | 'any';
}

export const defaultPreferences: Preferences = {
	depth: 'charcoal',
	vividness: 'balanced',
	mood: 'any'
};

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

function accents(
	hue: number,
	chroma: number,
	lightL = isYellowish(hue) ? random(0.74, 0.8) : random(0.5, 0.6),
	darkL = random(0.7, 0.79)
) {
	const lightAccent = fit([lightL, chroma, hue]);
	const darkAccent = fit([darkL, Math.min(chroma, 0.19), hue]);

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

const depths: Record<Depth, [number, number]> = {
	charcoal: [0.12, 0.185],
	deep: [0.07, 0.11],
	black: [0, 0.035]
};

const chromas: Record<Vividness, [number, number]> = {
	muted: [0.05, 0.1],
	balanced: [0.12, 0.21],
	vivid: [0.2, 0.28]
};

function backgroundHue(hue: number, mood: Mood) {
	return { neutral: 0, tinted: hue, cool: 250, warm: 75, split: wrap(hue + 180) }[mood];
}

function backgrounds(hue: number, mood: Mood, depth: Depth) {
	const bgHue = backgroundHue(hue, mood);
	const tone = (max: number) => (mood === 'neutral' ? 0 : random(max * 0.35, max));

	return {
		light: {
			bg: [random(0.965, 0.99), tone(0.014), bgHue] as Oklch,
			fg: [random(0.17, 0.24), tone(0.02), bgHue] as Oklch,
			tint: Math.round(random(0, 3) * 2) / 2,
			border: Math.round(random(8, 15))
		},
		dark: {
			bg: fit([random(...depths[depth]), tone(0.022), bgHue]),
			fg: [random(0.92, 0.97), tone(0.012), bgHue] as Oklch,
			tint: Math.round(random(2, 10) * 2) / 2,
			border: Math.round(random(11, 19))
		}
	};
}

const radii = [0, 0.5, 0.75, 1, 1, 1.25, 1.5, 2] as const;
const moods: Mood[] = ['neutral', 'tinted', 'tinted', 'cool', 'warm', 'split'];

export function generate(
	previous?: Theme,
	locks?: Locks,
	prefs: Preferences = defaultPreferences
): Theme {
	const keepAccent = previous && locks?.accent;
	const keepBackground = previous && locks?.background;
	const keepShape = previous && locks?.shape;

	const hue = keepAccent ? previous.hue : random(0, 360);
	const mood = keepBackground ? previous.mood : prefs.mood === 'any' ? pick(moods) : prefs.mood;

	const accent = keepAccent
		? {
				light: pickAccent(previous.light),
				dark: pickAccent(previous.dark)
			}
		: accents(hue, random(...chromas[prefs.vividness]));
	const background = keepBackground
		? {
				light: pickBackground(previous.light),
				dark: pickBackground(previous.dark)
			}
		: backgrounds(hue, mood, prefs.depth);

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

function pickBackground({ bg, fg, tint, border }: Scheme) {
	return { bg, fg, tint, border };
}

/* -- tuning ------------------------------------------------------------- */

export interface Tuning {
	hue: number;
	chroma: number;
	lightBg: number;
	darkBg: number;
	/** Chroma of both backgrounds, before the gamut is applied. */
	tone: number;
	lightTint: number;
	darkTint: number;
	lightBorder: number;
	darkBorder: number;
	radius: number;
}

export function tuningOf(theme: Theme): Tuning {
	return {
		hue: theme.hue,
		chroma: theme.light.accent[1],
		lightBg: theme.light.bg[0],
		darkBg: theme.dark.bg[0],
		tone: theme.dark.bg[1],
		lightTint: theme.light.tint,
		darkTint: theme.dark.tint,
		lightBorder: theme.light.border,
		darkBorder: theme.dark.border,
		radius: theme.radius
	};
}

/** Rebuild a theme from hand-picked values, keeping whatever was not touched. */
export function retune(theme: Theme, t: Tuning): Theme {
	const flipped = isYellowish(t.hue) !== isYellowish(theme.hue);
	const lightL = flipped ? (isYellowish(t.hue) ? 0.77 : 0.55) : theme.light.accent[0];
	const accent = accents(t.hue, t.chroma, lightL, theme.dark.accent[0]);

	const bgHue = backgroundHue(t.hue, theme.mood);
	const tone = theme.mood === 'neutral' ? 0 : t.tone;
	const shade = (l: number, scale: number): Oklch => fit([l, tone * scale, bgHue]);

	return {
		...theme,
		name: nameFor(t.hue, theme.mood),
		hue: t.hue,
		radius: t.radius,
		light: {
			...theme.light,
			...accent.light,
			bg: shade(t.lightBg, 0.64),
			fg: shade(theme.light.fg[0], 0.9),
			tint: t.lightTint,
			border: t.lightBorder
		},
		dark: {
			...theme.dark,
			...accent.dark,
			bg: shade(t.darkBg, 1),
			fg: shade(theme.dark.fg[0], 0.55),
			tint: t.darkTint,
			border: t.darkBorder
		}
	};
}

/* -- output --------------------------------------------------------------- */

/** Borders that carry weight — focus rings, control outlines — stay a step up. */
const strongBorder = (border: number) => Math.min(60, Math.round(border * 1.6 + 26));

/** The custom properties for one scheme, ready for style attributes or CSS. */
export function tokens(scheme: Scheme, radius: number): Record<string, string> {
	return {
		'--ck-bg': css(scheme.bg),
		'--ck-fg': css(scheme.fg),
		'--ck-accent': css(scheme.accent),
		'--ck-accent-hover': css(scheme.accentHover),
		'--ck-accent-fg': css(scheme.accentFg),
		'--ck-tint': `${scheme.tint}%`,
		'--ck-mix-border': `${scheme.border}%`,
		'--ck-mix-border-strong': `${strongBorder(scheme.border)}%`,
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
		s.tint,
		s.border
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
		// Links shared before borders were adjustable carry no value for them.
		const scheme = ([bg, fg, accent, accentHover, accentFg, tint, border = 12]: unknown[]) =>
			({ bg, fg, accent, accentHover, accentFg, tint, border }) as Scheme;

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
