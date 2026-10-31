<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		label: string;
		value: string | number;
		/** e.g. `+12.5%` — coloured by `trend`. */
		change?: string;
		trend?: 'up' | 'down' | 'flat';
		hint?: string;
		icon?: Snippet;
		class?: string;
	}

	let { label, value, change, trend = 'flat', hint, icon, class: className }: Props = $props();

	const trends = {
		up: 'text-success',
		down: 'text-danger',
		flat: 'text-fg-muted'
	};

	const arrows = {
		up: 'm12 19V5m0 0-6 6m6-6 6 6',
		down: 'M12 5v14m0 0 6-6m-6 6-6-6',
		flat: 'M5 12h14'
	};
</script>

<div class={cn('rounded-lg border border-border bg-surface p-5', className)}>
	<div class="flex items-start justify-between gap-3">
		<p class="text-sm text-fg-muted">{label}</p>
		{#if icon}
			<span class="shrink-0 text-fg-subtle">{@render icon()}</span>
		{/if}
	</div>

	<p class="mt-2 text-2xl leading-none font-semibold tracking-tight text-fg tabular-nums">
		{value}
	</p>

	{#if change || hint}
		<div class="mt-2.5 flex items-center gap-2">
			{#if change}
				<span class={cn('inline-flex items-center gap-1 text-xs font-medium', trends[trend])}>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-3.5">
						<path
							d={arrows[trend]}
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					{change}
				</span>
			{/if}
			{#if hint}
				<span class="text-xs text-fg-subtle">{hint}</span>
			{/if}
		</div>
	{/if}
</div>
