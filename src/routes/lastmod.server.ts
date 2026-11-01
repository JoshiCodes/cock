/**
 * Sitemap dates, read out of the git history.
 *
 * A `<lastmod>` that moves every time the site is rebuilt teaches crawlers that
 * the date means nothing, and they stop reading it. So it has to come from the
 * content: the last commit that touched the files a page is actually made of.
 *
 * Where git cannot answer — no repository, a shallow clone, git not installed —
 * the date is left out of the sitemap rather than filled in with today.
 * Server-only: it shells out to git, which only exists at build time.
 */
import { execFileSync } from 'node:child_process';
import { components, type ComponentMeta } from './components/catalog.js';

function git(args: string[]): string | null {
	try {
		return execFileSync('git', args, {
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
			stdio: ['ignore', 'pipe', 'ignore']
		});
	} catch {
		return null;
	}
}

/** Every tracked file with the date of the last commit that touched it. */
function history(): Map<string, string> {
	const dates = new Map<string, string>();

	// A shallow clone only knows the tip, which would date the whole site the
	// same day — exactly the lie this module exists to avoid.
	if (git(['rev-parse', '--is-shallow-repository'])?.trim() !== 'false') return dates;

	const log = git([
		'-c',
		'core.quotepath=false',
		'log',
		'--no-merges',
		'--pretty=format:%x01%cs',
		'--name-only'
	]);
	if (!log) return dates;

	// Newest commit first, so the first time a path appears is its latest change.
	let date = '';
	for (const line of log.split('\n')) {
		if (line.startsWith('\x01')) date = line.slice(1);
		else if (line && date && !dates.has(line)) dates.set(line, date);
	}
	return dates;
}

const dates = history();

/**
 * Which files a page is made of.
 *
 * The shared plumbing — the layout, the prose styles, the token file — is left
 * out on purpose. Counting it would move every page on the same day and put us
 * back where we started.
 */
const guides: Record<string, string[]> = {
	'/': ['src/routes/+page.svelte', 'src/routes/facts.ts'],
	'/docs/getting-started': ['src/routes/docs/getting-started/'],
	'/docs/theming': ['src/routes/docs/theming/', 'src/lib/styles/theme.css'],
	'/docs/utilities': ['src/routes/docs/utilities/', 'src/lib/utils/', 'src/lib/actions/'],
	'/docs/types': ['src/routes/docs/types/'],
	'/docs/comparison': ['src/routes/docs/comparison/'],
	'/components': ['src/routes/components/+page.svelte', 'src/routes/components/catalog.ts'],
	'/themes': ['src/routes/themes/']
};

/** A component page is its own source, its parts, and its examples. */
function componentSources(entry: ComponentMeta): string[] {
	const names = [entry.name, ...(entry.parts ?? [])];
	return [
		...names.map((name) => `/${name}.svelte`),
		`src/routes/components/examples/${entry.slug}/`
	];
}

const sources = new Map<string, string[]>([
	...Object.entries(guides),
	...components.map(
		(entry) => [`/components/${entry.slug}`, componentSources(entry)] as [string, string[]]
	)
]);

/**
 * The day a page last changed, or undefined when git could not say. Dates are
 * ISO `YYYY-MM-DD`, which sorts correctly as a string.
 */
export function lastmod(path: string): string | undefined {
	const fragments = sources.get(path);
	if (!fragments || dates.size === 0) return undefined;

	let latest: string | undefined;
	for (const [file, date] of dates) {
		if (!fragments.some((fragment) => file.includes(fragment))) continue;
		if (!latest || date > latest) latest = date;
	}
	return latest;
}
