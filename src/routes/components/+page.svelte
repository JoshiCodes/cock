<script lang="ts">
	import { Card } from '@joshicodes/cock';
	import Seo from '../showcase/Seo.svelte';
	import { components, grouped } from './catalog.js';
	import { stats } from '../facts.js';
</script>

<Seo
	title="{stats.components} Svelte 5 components for Tailwind 4"
	path="/components"
	description="All {components.length} pages of the cock component kit: buttons, forms, overlays, navigation, data and effects, each with examples and a full prop table."
/>

<div class="max-w-3xl space-y-12 py-10 lg:py-14">
	<header class="space-y-4">
		<h1 class="text-3xl font-semibold tracking-tight text-fg">Components</h1>
		<p class="text-lg leading-relaxed text-fg-muted">
			{stats.components} components across {components.length} pages — a few, like the card and its header,
			are documented together. Each page covers the props, the keyboard behaviour and the things worth
			knowing before you use it.
		</p>
	</header>

	{#each grouped as group (group.category.id)}
		<section class="space-y-4">
			<div>
				<h2 class="text-xl font-semibold tracking-tight text-fg">{group.category.title}</h2>
				<p class="mt-1 text-sm text-fg-muted">{group.category.blurb}</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				{#each group.items as item (item.slug)}
					<a href="/components/{item.slug}" class="group">
						<Card variant="raised" padding="md" class="h-full">
							<p class="font-medium text-fg group-hover:text-accent">{item.name}</p>
							<p class="mt-1 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
						</Card>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</div>
