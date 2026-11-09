<script lang="ts">
	import { Button } from '@joshicodes/cock';
	import Seo from '../../showcase/Seo.svelte';
	import { components } from '../../components/catalog.js';
	import { bySlug, categoryNames, templates } from '../registry.js';
	import TemplateBlock from '../TemplateBlock.svelte';
	import TemplateThumb from '../TemplateThumb.svelte';

	let { data } = $props();

	let template = $derived(bySlug.get(data.slug)!);
	let index = $derived(templates.indexOf(template));
	let previous = $derived(templates[index - 1]);
	let next = $derived(templates[index + 1]);
	let siblings = $derived(
		templates
			.filter((other) => other.category === template.category && other !== template)
			.slice(0, 3)
	);

	/** The docs page a component is described on, if it has one. */
	function docsFor(name: string) {
		return components.find((entry) => entry.name === name || entry.parts?.includes(name));
	}

	let copied = $state(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(template.source);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<Seo
	title="{template.title} template for Svelte"
	description={template.description ??
		`A ${template.title.toLowerCase()} template built with cock, ready to copy.`}
	path="/templates/{template.slug}"
/>

<div class="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
	<nav aria-label="Breadcrumb" class="text-sm text-fg-muted">
		<a href="/templates" class="hover:text-fg">Templates</a>
		<span aria-hidden="true" class="mx-1.5 text-fg-subtle">/</span>
		<span>{categoryNames[template.category]}</span>
	</nav>

	<header class="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
		<div class="max-w-2xl">
			<h1 class="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{template.title}</h1>
			{#if template.description}
				<p class="mt-3 text-lg leading-relaxed text-fg-muted">{template.description}</p>
			{/if}
		</div>
		<Button onclick={copy}>{copied ? 'Copied to clipboard' : 'Copy the code'}</Button>
	</header>

	<div class="mt-8">
		<TemplateBlock {template} />
	</div>

	{#if template.uses.length}
		<div class="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm">
			<span class="text-fg-muted">Made with</span>
			{#each template.uses as name, i (name)}
				{@const entry = docsFor(name)}
				<span class="text-fg">
					{#if entry}
						<a
							href="/components/{entry.slug}"
							class="underline decoration-border-strong underline-offset-4 hover:decoration-current"
							>{name}</a
						>{:else}{name}{/if}{#if i < template.uses.length - 1}<span class="text-fg-subtle"
							>,</span
						>{/if}
				</span>
			{/each}
		</div>
	{/if}

	<nav
		aria-label="More templates"
		class="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2"
	>
		{#if previous}
			<a href="/templates/{previous.slug}" class="group bg-bg px-5 py-4 hover:bg-surface">
				<span class="text-xs text-fg-subtle">Previous</span>
				<span class="mt-1 block font-medium text-fg group-hover:text-accent"
					><span aria-hidden="true">←</span> {previous.title}</span
				>
			</a>
		{:else}
			<span class="bg-bg max-sm:hidden"></span>
		{/if}
		{#if next}
			<a href="/templates/{next.slug}" class="group bg-bg px-5 py-4 text-right hover:bg-surface">
				<span class="text-xs text-fg-subtle">Next</span>
				<span class="mt-1 block font-medium text-fg group-hover:text-accent"
					>{next.title} <span aria-hidden="true">→</span></span
				>
			</a>
		{:else}
			<span class="bg-bg max-sm:hidden"></span>
		{/if}
	</nav>

	{#if siblings.length}
		<section class="mt-16" aria-labelledby="siblings-title">
			<h2 id="siblings-title" class="text-lg font-semibold tracking-tight text-fg">
				More for {categoryNames[template.category].toLowerCase()}
			</h2>
			<ul class="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each siblings as other (other.slug)}
					<li class="group relative">
						<div
							class="overflow-hidden rounded-lg border border-border transition-colors group-hover:border-border-strong"
						>
							<TemplateThumb template={other} />
						</div>
						<a
							href="/templates/{other.slug}"
							class="focus-visible:after:ring-ring mt-3 block font-medium text-fg group-hover:text-accent after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2"
							>{other.title}</a
						>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
