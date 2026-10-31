<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** One number per cell, filled column by column. */
		data: number[];
		/** Cells per column; 7 gives one week per column. */
		rows?: number;
		/** Cell edge in pixels. Ignored with `fit`. */
		cellSize?: number;
		/** Stretch the cells so the grid fills its container's width. */
		fit?: boolean;
		gap?: number;
		/** Number of colour steps above zero. */
		levels?: number;
		/** Value that counts as full colour. Defaults to the largest value. */
		max?: number;
		/** Tooltip text for a cell. */
		describe?: (value: number, index: number) => string;
		legend?: boolean;
		/** Summary for screen readers. */
		label?: string;
		class?: string;
	}

	let {
		data,
		rows = 7,
		cellSize = 11,
		fit = false,
		gap = 3,
		levels = 4,
		max,
		describe = (value) => String(value),
		legend = true,
		label,
		class: className
	}: Props = $props();

	let top = $derived(max ?? Math.max(1, ...data));
	let columns = $derived(Math.ceil(data.length / rows));

	function level(value: number) {
		if (value <= 0) return 0;
		return Math.min(levels, Math.ceil((value / top) * levels));
	}

	function color(step: number) {
		if (step === 0) return 'var(--ck-muted)';
		return `color-mix(in oklab, var(--ck-accent) ${Math.round((step / levels) * 100)}%, var(--ck-muted))`;
	}
</script>

<div class={cn('flex-col gap-2', fit ? 'flex w-full' : 'inline-flex', className)}>
	<div
		role="img"
		aria-label={label}
		class="grid grid-flow-col"
		style:grid-template-rows="repeat({rows}, {fit ? 'auto' : `${cellSize}px`})"
		style:grid-template-columns={fit ? `repeat(${columns}, minmax(0, 1fr))` : undefined}
		style:grid-auto-columns={fit ? undefined : `${cellSize}px`}
		style:gap="{gap}px"
	>
		{#each data as value, index (index)}
			<span
				title={describe(value, index)}
				class={cn('rounded-xs', fit && 'aspect-square')}
				style:background={color(level(value))}
			></span>
		{/each}
	</div>

	{#if legend}
		<div class="flex items-center gap-1.5 self-end text-xs text-fg-subtle" aria-hidden="true">
			<span class="mr-0.5">Less</span>
			{#each { length: levels + 1 } as _, step (step)}
				<span
					class="rounded-xs"
					style:width="{cellSize}px"
					style:height="{cellSize}px"
					style:background={color(step)}
				></span>
			{/each}
			<span class="ml-0.5">More</span>
		</div>
	{/if}
</div>
