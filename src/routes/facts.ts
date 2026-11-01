/**
 * Measured, not estimated.
 *
 * Each row is a Vite library build against the packaged `dist`, minified, with
 * svelte external, gzipped. Re-measure after a release by bundling the same
 * entry points; the baseline row is clsx + tailwind-merge, which every
 * component shares.
 */
export const bundle = {
	measuredAt: '2026-11-01',
	version: '0.1.0',
	rows: [
		{ label: 'clsx + tailwind-merge (shared baseline)', exports: 0, raw: 37.7, gzip: 9.7 },
		{ label: 'One Button', exports: 1, raw: 41.3, gzip: 11.0 },
		{
			label: 'A form: Field, Input, Select, Checkbox, Switch, Button',
			exports: 6,
			raw: 53.0,
			gzip: 13.5
		},
		{
			label: 'A typical app screen: card, table, modal, menu, tabs, toasts',
			exports: 20,
			raw: 76.5,
			gzip: 19.5
		},
		{ label: 'Every export in the package', exports: 63, raw: 163.6, gzip: 39.2 }
	],
	css: { raw: 9.2, gzip: 2.7 }
};

export const stats = {
	components: 63,
	pages: 50,
	runtimeDependencies: 2,
	/** Beyond the shared baseline, averaged over all 63. */
	perComponentGzipKb: 0.47
};
