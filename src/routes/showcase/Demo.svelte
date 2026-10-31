<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '#lib';
	import CodeBlock from './CodeBlock.svelte';
	import { DEMO_SOURCE, type DemoSource } from './source.js';

	interface Props {
		title?: string;
		description?: string;
		/**
		 * Code shown behind the toggle. Defaults to this demo's own markup, read
		 * from the section's source; pass `false` to hide the toggle.
		 */
		code?: string | false;
		layout?: 'row' | 'col' | 'grid' | 'bare';
		children: Snippet;
	}

	let { title, description, code: override, layout = 'row', children }: Props = $props();

	// Always take one, even when overridden, so later demos stay in step.
	const own = getContext<DemoSource | undefined>(DEMO_SOURCE)?.take();
	let code = $derived(override === false ? undefined : (override ?? own));

	let showCode = $state(false);

	const layouts = {
		row: 'flex flex-wrap items-center gap-3',
		col: 'flex flex-col gap-4',
		grid: 'grid gap-4 sm:grid-cols-2',
		bare: ''
	};
</script>

<div>
	{#if title || code}
		<div class="mb-3 flex items-end justify-between gap-4">
			<div class="min-w-0">
				{#if title}
					<h3 class="text-[0.9375rem] font-medium text-fg">{title}</h3>
				{/if}
				{#if description}
					<p class="mt-0.5 text-sm text-fg-muted">{description}</p>
				{/if}
			</div>

			{#if code}
				<button
					type="button"
					onclick={() => (showCode = !showCode)}
					aria-expanded={showCode}
					class="shrink-0 cursor-pointer text-sm text-fg-muted transition-colors hover:text-fg"
				>
					{showCode ? 'Hide code' : 'Show code'}
				</button>
			{/if}
		</div>
	{/if}

	<div class="overflow-hidden rounded-lg border border-border">
		<div class={cn('bg-bg px-6 py-8', layouts[layout])}>
			{@render children()}
		</div>

		{#if code && showCode}
			<div transition:slide={{ duration: 180 }}>
				<CodeBlock {code} class="border-t border-border" />
			</div>
		{/if}
	</div>
</div>
