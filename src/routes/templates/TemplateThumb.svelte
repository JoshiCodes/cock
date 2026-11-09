<script lang="ts">
	import type { Template } from './registry.js';

	let { template }: { template: Template } = $props();

	// Rendered at a desktop width, then scaled down to the card.
	const base = 1024;
	let width = $state(0);
	let scale = $derived(width / base);
	let values = $derived({
		...Object.fromEntries(
			(template.meta.options ?? []).map((option) => [option.name, option.default])
		),
		...template.meta.thumbnail
	});
	const Demo = $derived(template.component);
</script>

<div bind:clientWidth={width} class="relative aspect-[3/2] overflow-hidden bg-bg">
	<!-- Hidden until measured, so it never shows at the wrong size first. -->
	<div
		inert
		aria-hidden="true"
		class="@container pointer-events-none absolute top-0 left-0 grid origin-top-left transition-opacity duration-200"
		class:opacity-0={!width}
		style:width="{base}px"
		style:min-height="{(base * 2) / 3}px"
		style:transform="scale({scale})"
	>
		<Demo {...values} />
	</div>
</div>
