import { theme } from '@joshicodes/cock';

const always = [
	'--ck-bg',
	'--ck-fg',
	'--ck-accent',
	'--ck-accent-hover',
	'--ck-accent-fg',
	'--ck-tint',
	'--ck-radius-scale'
];

// Long defaults that only belong in the export when someone changed them.
const whenChanged = ['--ck-shadow-sm', '--ck-shadow', '--ck-shadow-lg'];

/**
 * Resolve what a scheme actually uses, preset and overrides included, by
 * asking the browser: a hidden element with that scheme's theme applied.
 */
function resolve(scheme: 'light' | 'dark'): [string, string][] {
	const overrides = theme.tokensFor(scheme);
	const probe = document.createElement('div');
	probe.dataset.ckTheme = scheme;
	probe.dataset.accent = theme.accent;
	probe.hidden = true;
	for (const [name, value] of Object.entries(overrides)) probe.style.setProperty(name, value);

	document.body.append(probe);
	const style = getComputedStyle(probe);
	const names = [...always, ...whenChanged.filter((name) => name in overrides)];
	const values = names.map((name): [string, string] => [name, style.getPropertyValue(name).trim()]);
	probe.remove();

	return values;
}

export function exportTheme(): string {
	const block = (selector: string, values: [string, string][]) =>
		`${selector} {\n${values.map(([name, value]) => `\t${name}: ${value};`).join('\n')}\n}`;

	const light = resolve('light');
	const dark = resolve('dark').filter(([name]) => name !== '--ck-radius-scale');

	return [
		'/* Exported from cock — paste after the cock import */',
		block(':root', light),
		block('.dark', dark)
	].join('\n\n');
}
