import { toHex } from '../showcase/color.js';
import { styleAttribute, type Theme } from './generate.js';

/**
 * Contrast audit against WCAG 2.1.
 *
 * The derived tokens are mixed by the browser with `color-mix`, so rather than
 * reimplementing that here, this paints a hidden element with the theme applied
 * and reads back what the browser actually computed.
 */

export interface Check {
	label: string;
	/** Foreground and background, as painted. */
	ratio: number;
	/** 4.5 for body text, 3 for large text and non-text parts of the interface. */
	required: number;
	passes: boolean;
	hint: string;
}

export interface Audit {
	checks: Check[];
	passed: number;
	/** True when every check at the 4.5 level passes. */
	aa: boolean;
}

const pairs: { label: string; fg: string; bg: string; required: number; hint: string }[] = [
	{
		label: 'Body text',
		fg: '--ck-fg',
		bg: '--ck-canvas',
		required: 4.5,
		hint: 'Paragraphs and headings'
	},
	{
		label: 'Secondary text',
		fg: '--ck-fg-muted',
		bg: '--ck-canvas',
		required: 4.5,
		hint: 'Descriptions and captions'
	},
	{
		label: 'Placeholder text',
		fg: '--ck-fg-subtle',
		bg: '--ck-canvas',
		required: 4.5,
		hint: 'Input placeholders and hints'
	},
	{
		label: 'Text on the accent',
		fg: '--ck-accent-fg',
		bg: '--ck-accent',
		required: 4.5,
		hint: 'Labels inside solid buttons'
	},
	{
		label: 'Accent as text',
		fg: '--ck-accent',
		bg: '--ck-canvas',
		required: 4.5,
		hint: 'Links and soft buttons'
	},
	{
		label: 'Borders and controls',
		fg: '--ck-border-strong',
		bg: '--ck-canvas',
		required: 3,
		hint: 'Checkbox outlines, dividers'
	}
];

function channels(hex: string): [number, number, number] {
	const value = hex.replace('#', '');
	return [
		parseInt(value.slice(0, 2), 16),
		parseInt(value.slice(2, 4), 16),
		parseInt(value.slice(4, 6), 16)
	];
}

function relativeLuminance(hex: string): number {
	const [r, g, b] = channels(hex).map((channel) => {
		const c = channel / 255;
		return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(foreground: string, background: string): number {
	const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
		(a, b) => b - a
	);
	return (light + 0.05) / (dark + 0.05);
}

/** Resolve every token of a scheme to hex, by letting the browser compute them. */
function resolve(theme: Theme, scheme: 'light' | 'dark'): Record<string, string> {
	const probe = document.createElement('div');
	probe.dataset.ckTheme = scheme;
	probe.setAttribute('style', styleAttribute(theme[scheme], theme.radius));
	probe.hidden = true;
	document.body.append(probe);

	const computed = getComputedStyle(probe);
	const tokens = new Set(pairs.flatMap((pair) => [pair.fg, pair.bg]));
	const values = Object.fromEntries(
		[...tokens].map((token) => [token, toHex(computed.getPropertyValue(token).trim())])
	);

	probe.remove();
	return values;
}

export function audit(theme: Theme, scheme: 'light' | 'dark'): Audit {
	if (typeof document === 'undefined') return { checks: [], passed: 0, aa: true };

	const values = resolve(theme, scheme);
	const checks = pairs.map((pair) => {
		const value = ratio(values[pair.fg], values[pair.bg]);
		return {
			label: pair.label,
			hint: pair.hint,
			required: pair.required,
			ratio: value,
			passes: value >= pair.required
		};
	});

	return {
		checks,
		passed: checks.filter((check) => check.passes).length,
		aa: checks.every((check) => check.passes)
	};
}

/** True when both schemes clear every threshold. */
export function passesAA(theme: Theme): boolean {
	return audit(theme, 'light').aa && audit(theme, 'dark').aa;
}
