<script lang="ts">
	import { Code } from '@joshicodes/cock';
	import CodeBlock from '../../showcase/CodeBlock.svelte';
	import Prose from '../../showcase/Prose.svelte';
	import Seo from '../../showcase/Seo.svelte';

	let { data } = $props();

	// Grouped in the order the groups are declared, not alphabetically.
	const order = ['Component types', 'Theme and toasts', 'Actions', 'Helpers'];
	let groups = $derived(
		order
			.map((title) => ({ title, items: data.types.filter((entry) => entry.group === title) }))
			.filter((group) => group.items.length)
	);
</script>

<Seo
	title="TypeScript types in the cock component kit"
	path="/docs/types"
	description="Every type the cock component kit exports, written out in full: variants, options, the theme state, toasts, action parameters and the command palette."
/>

<Prose>
	<h1 class="text-3xl font-semibold tracking-tight text-fg">Types</h1>
	<p class="text-lg">
		Every type the package exports, printed from the source. The prop tables link here whenever a
		prop is typed as one of them, so <Code>variant?: ButtonVariant</Code> is one click away from the six
		strings it allows.
	</p>
	<p>
		You rarely need to import any of these. Props are inferred, and the union types exist so your
		editor can finish the string for you. Import them when you are passing values around: a
		<Code>SelectOption[]</Code> coming out of a load function, or your own wrapper component that forwards
		a variant.
	</p>

	<nav aria-label="All types" class="mt-8 flex flex-wrap gap-2">
		{#each data.types as entry (entry.name)}
			<a
				href="#{entry.name}"
				class="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
			>
				{entry.name}
			</a>
		{/each}
	</nav>

	{#each groups as group (group.title)}
		<h2 id={group.title.toLowerCase().replace(/\s+/g, '-')}>{group.title}</h2>

		<div class="mt-6 space-y-8">
			{#each group.items as entry (entry.name)}
				<section id={entry.name} class="scroll-mt-28">
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
						<h3 class="font-mono !text-base font-semibold text-fg">{entry.name}</h3>
						<span class="font-mono text-xs text-fg-subtle">{entry.module}</span>
					</div>

					{#if entry.description}
						<p class="mt-2 text-sm">{entry.description}</p>
					{/if}

					<div class="mt-3 overflow-hidden rounded-lg border border-border">
						<CodeBlock code={entry.code} />
					</div>
				</section>
			{/each}
		</div>
	{/each}
</Prose>
