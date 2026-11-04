<script lang="ts">
	import type { StatusTone } from '../primitives/StatusDot.svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** One tone per bar, oldest first. `null` is a period without data. */
		data: (StatusTone | null)[];
		/** Tooltip text for a bar. */
		describe?: (tone: StatusTone | null, index: number) => string;
		/** Bar height in pixels. */
		height?: number;
		gap?: number;
		/** Narrowest a bar may get. Below that the row scrolls instead of shrinking. */
		minBar?: number;
		/** Label under the first bar, e.g. "90 days ago". */
		start?: string;
		/** Label under the last bar, e.g. "Today". */
		end?: string;
		/** Tones to explain under the bars, with their meaning. */
		legend?: { tone: StatusTone | null; label: string }[];
		/** Summary for screen readers. */
		label?: string;
		class?: string;
	}

	let {
		data,
		describe,
		height = 32,
		gap = 2,
		minBar = 3,
		start,
		end,
		legend,
		label,
		class: className
	}: Props = $props();

	const tones: Record<StatusTone, string> = {
		neutral: 'bg-fg-subtle',
		accent: 'bg-accent',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};

	const fill = (tone: StatusTone | null) => (tone ? tones[tone] : 'bg-border-strong');
</script>

<div class={cn('flex w-full flex-col gap-2', className)}>
	<div class="overflow-x-auto">
		<div
			role="img"
			aria-label={label}
			class="flex"
			style:gap="{gap}px"
			style:height="{height}px"
			style:min-width="{data.length * (minBar + gap)}px"
		>
			{#each data as tone, index (index)}
				<span
					title={describe?.(tone, index)}
					class={cn('min-w-0 flex-1 rounded-xs transition-opacity hover:opacity-70', fill(tone))}
				></span>
			{/each}
		</div>
	</div>

	{#if start || end || legend?.length}
		<div
			class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs text-fg-subtle"
		>
			<span>{start}</span>
			{#if legend?.length}
				<span class="flex flex-wrap items-center gap-x-3 gap-y-1" aria-hidden="true">
					{#each legend as item (item.label)}
						<span class="inline-flex items-center gap-1.5">
							<span class={cn('size-2 rounded-xs', fill(item.tone))}></span>
							{item.label}
						</span>
					{/each}
				</span>
			{/if}
			<span>{end}</span>
		</div>
	{/if}
</div>
