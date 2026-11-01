import themeCss from '../../../lib/styles/theme.css?raw';

/** The default value of every `--ck-*` custom property, read from the stylesheet. */
function declarations(selector: string): Record<string, string> {
	const start = themeCss.indexOf(selector);
	if (start === -1) return {};

	const open = themeCss.indexOf('{', start);
	const block = themeCss.slice(open + 1, themeCss.indexOf('\n}', open));
	const found: Record<string, string> = {};

	for (const [, name, value] of block.matchAll(/(--ck-[\w-]+)\s*:\s*([^;]+);/g)) {
		found[name] = value.replace(/\s+/g, ' ').trim();
	}
	return found;
}

export function load() {
	return {
		light: declarations(":root,\n[data-ck-theme='light']"),
		dark: declarations(".dark,\n[data-ck-theme='dark']"),
		derived: declarations(':root,\n.dark,\n[data-ck-theme]')
	};
}
