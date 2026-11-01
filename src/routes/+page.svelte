<script lang="ts">
	import { Badge, Button, Card, Marquee, Terminal } from '@joshicodes/cock';
	import CodeBlock from './showcase/CodeBlock.svelte';
	import Seo from './showcase/Seo.svelte';
	import { bundle, stats } from './facts.js';
	import { components } from './components/catalog.js';
	import { site as meta } from './seo.js';

	// The home page shows the same demos the component pages do.
	import FormExample from './components/examples/field/01-label-and-error.svelte';
	import TableExample from './components/examples/table/02-dense.svelte';
	import StatExample from './components/examples/sparkline/01-trends.svelte';
	import MenuExample from './components/examples/dropdown-menu/01-menu.svelte';

	const theming = `:root {
	--ck-bg: oklch(0.985 0 0);
	--ck-fg: oklch(0.205 0 0);
	--ck-accent: oklch(0.52 0.18 316);
}`;

	const showcase = [
		{ title: 'Forms that wire themselves up', href: '/components/field', demo: FormExample },
		{ title: 'Tables in your theme colour', href: '/components/table', demo: TableExample },
		{ title: 'Numbers without a chart library', href: '/components/sparkline', demo: StatExample },
		{ title: 'Menus with the keyboard done', href: '/components/dropdown-menu', demo: MenuExample }
	];

	const numbers = [
		{ value: String(stats.components), label: 'components' },
		{ value: `${bundle.rows[1].gzip} kB`, label: 'gzipped for your first one' },
		{ value: String(stats.runtimeDependencies), label: 'runtime dependencies' },
		{ value: '3', label: 'variables to re-theme it' }
	];
</script>

<Seo
	structured={[
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareSourceCode',
			name: 'cock',
			alternateName: 'Core Component Kit',
			description: meta.description,
			url: meta.url,
			codeRepository: meta.repo,
			programmingLanguage: ['TypeScript', 'Svelte'],
			runtimePlatform: 'SvelteKit',
			license: 'https://opensource.org/licenses/MIT',
			author: { '@type': 'Person', ...meta.author }
		},
		{ '@context': 'https://schema.org', '@type': 'WebSite', name: meta.name, url: meta.url }
	]}
/>

<div class="border-b border-border">
	<div
		class="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-16 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:px-8 lg:pt-24 lg:pb-20"
	>
		<div>
			<h1
				class="max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-fg sm:text-[3.5rem]"
			>
				Svelte components that are up before you are.
			</h1>

			<p class="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
				Forms, dialogs, menus and tables with keyboard handling and dark mode already done. Restyle
				the lot with three CSS variables, or let the generator pick something for you.
			</p>

			<div class="mt-9 flex flex-wrap items-center gap-3">
				<Button size="lg" href="/docs/getting-started">Get started</Button>
				<Button size="lg" variant="outline" href="/components">Browse components</Button>
			</div>

			<p class="mt-8 text-sm text-fg-subtle">
				Big, juicy components. Size isn't everything, but {stats.components} of them certainly help.
			</p>
		</div>

		<Terminal
			title="~/new-project"
			startOnView={false}
			lines={[
				{ kind: 'command', text: 'bun add @joshicodes/cock', delay: 600 },
				{ text: '+ @joshicodes/cock@0.1.0', tone: 'success' },
				{
					text: `${stats.components} components, ${stats.runtimeDependencies} dependencies, no surprises`,
					tone: 'muted'
				},
				{ kind: 'command', text: 'bun run dev', delay: 900 },
				{ text: '  Local   http://localhost:5173', tone: 'muted' },
				{ text: 'cock-a-doodle-done in 412 ms', tone: 'accent', delay: 700 }
			]}
		/>
	</div>

	<Marquee class="border-t border-border py-4 text-sm text-fg-subtle" speed={30} gap="1.25rem">
		{#each components as item (item.slug)}
			<a href="/components/{item.slug}" class="transition-colors hover:text-fg">{item.name}</a>
			<span aria-hidden="true" class="size-1 rounded-full bg-border-strong"></span>
		{/each}
	</Marquee>
</div>

<div class="mx-auto max-w-7xl space-y-24 px-5 py-20 lg:px-8">
	<section class="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
		<div class="lg:sticky lg:top-28">
			<Badge variant="outline">Theming</Badge>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-fg">
				Three colours. Everything else follows.
			</h2>
			<p class="mt-4 leading-relaxed text-fg-muted">
				Surfaces, borders, hover states and secondary text are mixed from the background, the text
				colour and the accent with <code class="font-mono text-sm text-accent">color-mix</code>. No
				theme file, no build step, and it works on a subtree as happily as on the page.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<Button variant="outline" href="/docs/theming">How theming works</Button>
				<Button variant="soft" href="/themes">Generate a theme</Button>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg border border-border">
			<CodeBlock code={theming} label="src/app.css" />
		</div>
	</section>

	<section class="space-y-8">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<Badge variant="outline">A look at it</Badge>
				<h2 class="mt-4 text-3xl font-semibold tracking-tight text-fg">Four of the sixty-three</h2>
			</div>
			<Button variant="outline" href="/components">See all {stats.components}</Button>
		</div>

		<div class="grid gap-5 lg:grid-cols-2">
			{#each showcase as item (item.href)}
				{@const Demo = item.demo}
				<Card class="overflow-hidden" padding="none">
					<div class="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
						<p class="text-sm font-medium text-fg">{item.title}</p>
						<a href={item.href} class="shrink-0 text-sm text-fg-muted hover:text-accent">Docs</a>
					</div>
					<div class="flex min-h-48 flex-wrap items-center gap-3 bg-bg px-5 py-6">
						<Demo />
					</div>
				</Card>
			{/each}
		</div>
	</section>

	<section class="space-y-8">
		<div>
			<Badge variant="outline">Measured</Badge>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-fg">What it costs</h2>
			<p class="mt-4 max-w-2xl leading-relaxed text-fg-muted">
				Real bundles, not estimates: the package built, minified and gzipped. Importing one
				component does not pull in the other sixty-two.
			</p>
		</div>

		<dl class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each numbers as item (item.label)}
				<div class="rounded-lg border border-border bg-surface p-5">
					<dt class="text-sm text-fg-muted">{item.label}</dt>
					<dd class="mt-1 text-3xl font-semibold tracking-tight text-fg tabular-nums">
						{item.value}
					</dd>
				</div>
			{/each}
		</dl>

		<Button variant="outline" href="/docs/comparison">The full numbers, and how it compares</Button>
	</section>
</div>
