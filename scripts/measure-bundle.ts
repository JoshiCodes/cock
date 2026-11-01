/**
 * Measures what the package costs. The numbers on the home page and in the
 * comparison table come from here, which is the only reason they can be called
 * measured rather than estimated.
 *
 * Run `bun run build` first — this bundles the packaged `dist`, not the source
 * — then `bun run measure`, and paste the block it prints into
 * `src/routes/facts.ts`.
 *
 * Each row is a Vite library build of one entry point: minified, Svelte
 * left external (your app already has it), gzipped at the default level. The
 * baseline row is clsx and tailwind-merge on their own, because every component
 * shares them.
 */
import { gzipSync } from 'node:zlib';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const entryPoint = join(root, 'dist/index.js');

/** Value exports, so types — which cost nothing — are not counted. */
function exportCount(): number {
	const index = readFileSync(join(root, 'src/lib/index.ts'), 'utf8');
	const names = new Set<string>();

	for (const [, list] of index.matchAll(/export\s+\{([^}]*)\}\s+from/g)) {
		for (const token of list.split(',')) {
			const name = token.trim();
			if (!name || name.startsWith('type ')) continue;
			names.add(name.split(/\s+as\s+/).pop()!);
		}
	}
	return names.size;
}

const screen = [
	'Card',
	'CardHeader',
	'CardTitle',
	'CardDescription',
	'CardContent',
	'CardFooter',
	'Table',
	'Modal',
	'DropdownMenu',
	'MenuItem',
	'MenuLabel',
	'MenuSeparator',
	'Tabs',
	'TabList',
	'Tab',
	'TabPanel',
	'Toaster',
	'toast',
	'Button',
	'Badge'
];

const rows = [
	{
		label: 'clsx + tailwind-merge (shared baseline)',
		exports: 0,
		source: `export { clsx } from 'clsx';\nexport { twMerge } from 'tailwind-merge';`
	},
	{
		label: 'One Button',
		exports: 1,
		source: `export { Button } from ${JSON.stringify(entryPoint)};`
	},
	{
		label: 'A form: Field, Input, Select, Checkbox, Switch, Button',
		exports: 6,
		source: `export { Field, Input, Select, Checkbox, Switch, Button } from ${JSON.stringify(entryPoint)};`
	},
	{
		label: 'A typical app screen: card, table, modal, menu, tabs, toasts',
		exports: screen.length,
		source: `export { ${screen.join(', ')} } from ${JSON.stringify(entryPoint)};`
	},
	{
		label: 'Everything the package exports',
		exports: exportCount(),
		source: `export * from ${JSON.stringify(entryPoint)};`
	}
];

const kb = (bytes: number) => Number((bytes / 1024).toFixed(1));

async function measure(source: string): Promise<{ raw: number; gzip: number }> {
	// Inside the project: a folder in /tmp cannot resolve clsx or svelte.
	const dir = mkdtempSync(join(root, 'node_modules/.cache/cock-measure-'));
	const entry = join(dir, 'entry.js');
	const out = join(dir, 'out');
	writeFileSync(entry, source);
	mkdirSync(out, { recursive: true });

	try {
		await build({
			root,
			// The project's own config would drag SvelteKit in with it.
			configFile: false,
			logLevel: 'error',
			resolve: { alias: { '@joshicodes/cock': entryPoint } },
			plugins: [svelte({ compilerOptions: { runes: true } })],
			build: {
				outDir: out,
				emptyOutDir: true,
				// Whatever this Vite minifies with by default; v8 uses oxc.
				minify: true,
				lib: { entry, formats: ['es'], fileName: 'bundle' },
				// Svelte is a peer dependency: the app already pays for it.
				rollupOptions: { external: (id) => id === 'svelte' || id.startsWith('svelte/') }
			}
		});

		const bundle = readFileSync(join(out, 'bundle.js'));
		return { raw: kb(bundle.byteLength), gzip: kb(gzipSync(bundle).byteLength) };
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}

const measured = [];
for (const row of rows) {
	const { raw, gzip } = await measure(row.source);
	measured.push({ label: row.label, exports: row.exports, raw, gzip });
	console.error(`${String(gzip).padStart(6)} kB gzip   ${row.label}`);
}

const css = readFileSync(join(root, 'dist/styles/theme.css'));

console.log(`
export const bundle = {
	measuredAt: '${new Date().toISOString().slice(0, 10)}',
	version: '${pkg.version}',
	rows: ${JSON.stringify(measured, null, '\t').replace(/\n/g, '\n\t')},
	css: { raw: ${kb(css.byteLength)}, gzip: ${kb(gzipSync(css).byteLength)} }
};`);
