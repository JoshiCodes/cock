<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** 0 to `max`. Leave it out for a spinning, indeterminate ring. */
		value?: number;
		max?: number;
		/** Diameter in pixels. */
		size?: number;
		/** Stroke width in pixels. */
		thickness?: number;
		variant?: 'accent' | 'success' | 'warning' | 'danger';
		/** Print the percentage in the middle. */
		showValue?: boolean;
		label?: string;
		class?: string;
	}

	let {
		value,
		max = 100,
		size = 40,
		thickness = 4,
		variant = 'accent',
		showValue = false,
		label,
		class: className
	}: Props = $props();

	const colors = {
		accent: 'text-accent',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger'
	};

	let radius = $derived((size - thickness) / 2);
	let circumference = $derived(2 * Math.PI * radius);
	let fraction = $derived(value === undefined ? 0.25 : Math.min(1, Math.max(0, value / max)));
</script>

<span
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-label={label}
	class={cn(
		'relative inline-flex shrink-0 items-center justify-center',
		colors[variant],
		className
	)}
	style:width="{size}px"
	style:height="{size}px"
>
	<svg
		viewBox="0 0 {size} {size}"
		class={cn('size-full -rotate-90', value === undefined && 'ck-ring-spin')}
		aria-hidden="true"
	>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="var(--ck-muted)"
			stroke-width={thickness}
		/>
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke="currentColor"
			stroke-width={thickness}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={circumference * (1 - fraction)}
			class="transition-[stroke-dashoffset] duration-500 ease-out"
		/>
	</svg>

	{#if showValue && value !== undefined}
		<span
			class="absolute font-medium text-fg tabular-nums"
			style:font-size="{Math.max(10, size * 0.26)}px"
		>
			{Math.round(fraction * 100)}%
		</span>
	{/if}
</span>

<style>
	.ck-ring-spin {
		animation: ck-ring 0.9s linear infinite;
	}

	@keyframes ck-ring {
		from {
			transform: rotate(-90deg);
		}
		to {
			transform: rotate(270deg);
		}
	}
</style>
