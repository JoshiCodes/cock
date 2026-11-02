<script lang="ts">
	import { Button, Separator } from '@joshicodes/cock';
	import CodeBlock from '../../showcase/CodeBlock.svelte';
	import ExampleBlock from '../../showcase/ExampleBlock.svelte';
	import Inline from '../../showcase/Inline.svelte';
	import PropsTable from '../../showcase/PropsTable.svelte';
	import Seo from '../../showcase/Seo.svelte';
	import { site } from '../../seo.js';
	import { categoryOf, bySlug, pageTitle } from '../catalog.js';
	import { examplesFor } from '../examples.js';

	let { data } = $props();

	let meta = $derived(data.meta);
	let examples = $derived(examplesFor(meta.slug));
	let category = $derived(categoryOf(meta.category));

	let imports = $derived([meta.name, ...(meta.parts ?? []), ...(meta.exports ?? [])].join(', '));
	let importLine = $derived(`import { ${imports} } from '@joshicodes/cock';`);

	/** Components › Forms › Select in the search results, mirroring the link above the heading. */
	let breadcrumbs = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			['Components', '/components'],
			[category.title, `/components#${category.id}`],
			[meta.name, `/components/${meta.slug}`]
		].map(([name, path], index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name,
			item: new URL(path, site.url).href
		}))
	});

	/** Props, snippets and events get a table each, in that order. */
	const kinds = [
		{ kind: 'prop', label: 'Props' },
		{ kind: 'snippet', label: 'Snippets' },
		{ kind: 'event', label: 'Events' }
	] as const;
</script>

<Seo
	title={pageTitle(meta)}
	path="/components/{meta.slug}"
	structured={[breadcrumbs]}
	image="/og/{meta.slug}.png"
	imageAlt="{meta.name}, from cock: {meta.summary.replaceAll('`', '')}"
	description="{meta.name} for Svelte 5 and Tailwind 4. {meta.summary.replaceAll(
		'`',
		''
	)} Props, examples and keyboard behaviour."
/>

<article class="max-w-3xl space-y-12 py-10 lg:py-14">
	<header class="space-y-4">
		<a
			href="/components#{category.id}"
			class="text-sm text-fg-muted transition-colors hover:text-fg"
		>
			{category.title}
		</a>
		<h1 class="text-3xl font-semibold tracking-tight text-fg">{meta.name}</h1>
		<p class="text-lg leading-relaxed text-fg-muted">
			<Inline text={meta.description ?? meta.summary} />
		</p>

		<div class="overflow-hidden rounded-lg border border-border">
			<CodeBlock code={importLine} label="import" />
		</div>
	</header>

	{#if examples.length}
		<div class="space-y-10">
			{#each examples as example (example.id)}
				<ExampleBlock {example} />
			{/each}
		</div>
	{/if}

	{#if meta.keyboard?.length}
		<section class="space-y-3">
			<h2 class="text-xl font-semibold tracking-tight text-fg">Keyboard</h2>
			<dl class="divide-y divide-border rounded-lg border border-border">
				{#each meta.keyboard as [keys, what] (keys)}
					<div class="flex flex-col gap-1 p-3 sm:flex-row sm:items-baseline sm:gap-4">
						<dt class="shrink-0 font-mono text-xs text-accent sm:w-32">{keys}</dt>
						<dd class="text-sm text-fg-muted"><Inline text={what} /></dd>
					</div>
				{/each}
			</dl>
		</section>
	{/if}

	{#if meta.notes?.length}
		<section class="space-y-3">
			<h2 class="text-xl font-semibold tracking-tight text-fg">Behaviour</h2>
			<ul class="space-y-2.5">
				{#each meta.notes as note (note)}
					<li class="flex gap-3 text-sm leading-relaxed text-fg-muted">
						<span class="mt-2 size-1 shrink-0 rounded-full bg-accent"></span>
						<span><Inline text={note} /></span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="space-y-8">
		<div class="space-y-2">
			<h2 class="text-xl font-semibold tracking-tight text-fg">API</h2>
			<p class="text-sm leading-relaxed text-fg-muted">
				Read out of the component sources at build time, so it matches the version you installed.
				Every component also takes <code class="font-mono text-xs text-accent">class</code>, merged
				through tailwind-merge so your utility wins.
			</p>
		</div>

		{#each data.docs as doc, index (doc.name)}
			{#if index > 0}<Separator />{/if}

			<div class="space-y-6">
				{#if data.docs.length > 1}
					<h3 class="font-mono text-sm font-semibold text-fg">&lt;{doc.name}&gt;</h3>
				{/if}

				{#each kinds as { kind, label } (kind)}
					{@const rows = doc.props.filter((prop) => prop.kind === kind)}
					{#if rows.length}
						<PropsTable
							title={data.docs.length > 1 ? label : `${label} of ${doc.name}`}
							{rows}
							types={data.typeNames}
							forwards={kind === 'prop' ? doc.forwards : undefined}
						/>
					{/if}
				{/each}
			</div>
		{/each}
	</section>

	{#if meta.related?.length}
		<section class="space-y-3">
			<h2 class="text-xl font-semibold tracking-tight text-fg">See also</h2>
			<div class="flex flex-wrap gap-2">
				{#each meta.related as slug (slug)}
					{@const other = bySlug.get(slug)}
					{#if other}
						<Button variant="outline" size="sm" href="/components/{other.slug}">{other.name}</Button
						>
					{/if}
				{/each}
			</div>
		</section>
	{/if}
</article>
