<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext, untrack } from 'svelte';
	import { DEMO_SOURCE, demoBodies, type DemoSource } from './source.js';

	interface Props {
		id: string;
		title: string;
		description?: string;
		/** The section's own file, imported with `?raw`. Demos read their code from it. */
		source?: string;
		children: Snippet;
	}

	let { id, title, description, source, children }: Props = $props();

	// Demos are created in source order, so handing bodies out in sequence lines up.
	// The source is a static import; reading it once is the point.
	const bodies = untrack(() => (source ? demoBodies(source) : []));
	let next = 0;
	setContext<DemoSource>(DEMO_SOURCE, { take: () => bodies[next++] });
</script>

<section {id} class="scroll-mt-24">
	<header class="mb-8">
		<h2 class="text-2xl font-semibold tracking-tight text-fg">{title}</h2>
		{#if description}
			<p class="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-muted">{description}</p>
		{/if}
	</header>

	<div class="space-y-10">
		{@render children()}
	</div>
</section>
