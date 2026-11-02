/**
 * Measured, not estimated.
 *
 * Produced by `bun run measure` — see scripts/measure-bundle.ts — which builds
 * each entry point against the packaged `dist`, minified, with Svelte external,
 * and gzips the result. Re-run it after a release and paste the block in;
 * nudging a number by hand defeats the point of having it.
 */
export const bundle = {
	measuredAt: '2026-11-01',
	version: '1.0.0',
	rows: [
		{ label: 'clsx + tailwind-merge (shared baseline)', exports: 0, raw: 37.6, gzip: 9.6 },
		{ label: 'One Button', exports: 1, raw: 41.2, gzip: 10.9 },
		{
			label: 'A form: Field, Input, Select, Checkbox, Switch, Button',
			exports: 6,
			raw: 53,
			gzip: 13.5
		},
		{
			label: 'A typical app screen: card, table, modal, menu, tabs, toasts',
			exports: 20,
			raw: 68.5,
			gzip: 17.9
		},
		{ label: 'Everything the package exports', exports: 88, raw: 173.4, gzip: 41.5 }
	],
	css: { raw: 9.4, gzip: 2.8 }
};

export const stats = {
	components: 69,
	pages: 54,
	runtimeDependencies: 2,
	/** Beyond the shared baseline, averaged over all 69. */
	perComponentGzipKb: 0.48
};
