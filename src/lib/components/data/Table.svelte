<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** `accent` carries the theme color into the header, stripes and hover. */
		tone?: 'neutral' | 'accent';
		/** Tint every other row. */
		striped?: boolean;
		/** Highlight rows on hover. */
		hoverable?: boolean;
		dense?: boolean;
		/** Wrap in a bordered, scrollable container. */
		bordered?: boolean;
		caption?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		tone = 'neutral',
		striped = false,
		hoverable = true,
		dense = false,
		bordered = true,
		caption,
		class: className,
		children
	}: Props = $props();
</script>

<div
	class={cn(
		'w-full overflow-x-auto',
		bordered && 'rounded-lg border border-border bg-surface',
		bordered && tone === 'accent' && 'border-accent/25',
		className
	)}
>
	<table
		class={cn(
			'ck-table w-full border-collapse text-left text-sm',
			tone === 'accent' && 'ck-accent',
			dense && 'ck-dense',
			striped && 'ck-striped',
			hoverable && 'ck-hoverable'
		)}
	>
		{#if caption}
			<caption class="border-b border-border px-4 py-3 text-left text-xs text-fg-muted">
				{caption}
			</caption>
		{/if}
		{@render children?.()}
	</table>
</div>

<style>
	/* Everything below reads three local variables, so the tones only swap colors. */
	.ck-table {
		--row-line: var(--ck-border);
		--head-bg: color-mix(in oklab, var(--ck-muted) 55%, transparent);
		--head-fg: var(--ck-fg-muted);
		--stripe: color-mix(in oklab, var(--ck-muted) 50%, transparent);
		--hover: color-mix(in oklab, var(--ck-muted) 80%, transparent);
	}

	.ck-accent {
		--row-line: color-mix(in oklab, var(--ck-accent) 16%, var(--ck-border));
		--head-bg: var(--ck-accent-soft);
		--head-fg: var(--ck-accent);
		--stripe: color-mix(in oklab, var(--ck-accent) 5%, transparent);
		--hover: color-mix(in oklab, var(--ck-accent) 10%, transparent);
	}

	.ck-table :global(th) {
		padding: 0.625rem 1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--head-fg);
		background-color: var(--head-bg);
		white-space: nowrap;
		border-bottom: 1px solid var(--row-line);
	}

	.ck-table :global(td) {
		padding: 0.75rem 1rem;
		color: var(--ck-fg);
		border-bottom: 1px solid var(--row-line);
		vertical-align: middle;
	}

	.ck-table :global(tbody tr:last-child td) {
		border-bottom: none;
	}

	.ck-dense :global(th) {
		padding: 0.5rem 0.75rem;
	}

	.ck-dense :global(td) {
		padding: 0.5rem 0.75rem;
	}

	.ck-striped :global(tbody tr:nth-child(even)) {
		background-color: var(--stripe);
	}

	.ck-hoverable :global(tbody tr) {
		transition: background-color 120ms ease-out;
	}

	.ck-hoverable :global(tbody tr:hover) {
		background-color: var(--hover);
	}

	/* Selected rows, in either tone: <tr aria-selected="true">. */
	.ck-table :global(tbody tr[aria-selected='true']) {
		background-color: color-mix(in oklab, var(--ck-accent) 12%, transparent);
	}

	.ck-table :global(tbody tr[aria-selected='true'] td:first-child) {
		box-shadow: inset 2px 0 0 var(--ck-accent);
	}
</style>
