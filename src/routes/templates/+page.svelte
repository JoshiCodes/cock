<script lang="ts">
	import { GridBackground } from '@joshicodes/cock';
	import Seo from '../showcase/Seo.svelte';
	import { categories, categoryNames, templates } from './registry.js';
	import TemplateThumb from './TemplateThumb.svelte';

	let selected = $state('all');
	let visible = $derived(
		selected === 'all' ? templates : templates.filter((template) => template.category === selected)
	);
	const counts = Object.fromEntries(
		categories.map((category) => [
			category.slug,
			templates.filter((template) => template.category === category.slug).length
		])
	);
	const number = (template: (typeof templates)[number]) =>
		String(templates.indexOf(template) + 1).padStart(2, '0');
</script>

<Seo
	title="Svelte templates for login pages, pricing and dashboards"
	description="Ready-made Svelte 5 screens built with cock components: login and sign-up pages, pricing, heroes, settings and dashboards. Preview them, tune them, copy the code."
	path="/templates"
/>

<GridBackground size={28} major={4} fade="bottom" class="border-b border-border">
	<div class="mx-auto max-w-7xl px-5 pt-16 pb-12 lg:px-8 lg:pt-24 lg:pb-16">
		<p class="text-sm font-medium text-accent">Templates</p>
		<h1
			class="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-fg sm:text-6xl"
		>
			Whole screens, ready to paste.
		</h1>
		<p class="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
			Login pages, pricing tables, settings, dashboards. Every one is a single Svelte file made from
			the kit, so it follows your theme and you can change any line of it.
		</p>
	</div>
</GridBackground>

<div class="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
	<nav
		aria-label="Filter templates"
		class="-mx-1 flex [scrollbar-width:none] gap-1 overflow-x-auto border-b border-border"
	>
		{#each [{ slug: 'all', name: 'Everything' }, ...categories] as category (category.slug)}
			<button
				type="button"
				aria-pressed={selected === category.slug}
				onclick={() => (selected = category.slug)}
				class="-mb-px shrink-0 border-b-2 px-3 pt-1 pb-3 text-sm font-medium transition-colors aria-pressed:border-accent aria-pressed:text-fg aria-[pressed=false]:border-transparent aria-[pressed=false]:text-fg-muted aria-[pressed=false]:hover:text-fg"
			>
				<span>{category.name}</span>
				<span class="ml-0.5 align-super text-[0.65rem] text-fg-subtle">
					{category.slug === 'all' ? templates.length : counts[category.slug]}
				</span>
			</button>
		{/each}
	</nav>

	{#if selected !== 'all'}
		<p class="mt-5 text-sm text-fg-muted">
			{categories.find((category) => category.slug === selected)?.blurb}
		</p>
	{/if}

	<ul class="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
		{#each visible as template (template.slug)}
			<!-- The previews hold links of their own, so the card is not one big <a>:
			     the title link stretches over it instead. -->
			<li class="group relative">
				<div
					class="overflow-hidden rounded-lg border border-border shadow-sm transition-[border-color,box-shadow] group-hover:border-border-strong group-hover:shadow-md"
				>
					<TemplateThumb {template} />
				</div>
				<div class="mt-3 flex items-baseline gap-3">
					<span class="text-xs text-fg-subtle tabular-nums">{number(template)}</span>
					<div class="min-w-0">
						<h2 class="font-medium text-fg group-hover:text-accent">
							<a
								href="/templates/{template.slug}"
								class="focus-visible:after:ring-ring rounded-sm after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2"
								>{template.title}</a
							>
						</h2>
						<p class="mt-0.5 text-sm text-fg-muted">{categoryNames[template.category]}</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
