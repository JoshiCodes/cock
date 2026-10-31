<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		/** Show the current value above the track. */
		showValue?: boolean;
		format?: (value: number) => string;
		label?: string;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		showValue = false,
		format = (v: number) => String(v),
		label,
		class: className,
		onchange
	}: Props = $props();

	let percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={cn('w-full', disabled && 'opacity-60', className)}>
	{#if showValue || label}
		<div class="mb-2 flex items-baseline justify-between gap-3">
			{#if label}<span class="text-sm font-medium text-fg">{label}</span>{/if}
			{#if showValue}
				<span class="text-sm text-fg-muted tabular-nums">{format(value)}</span>
			{/if}
		</div>
	{/if}

	<input
		type="range"
		bind:value
		oninput={(event) => onchange?.(event.currentTarget.valueAsNumber)}
		{min}
		{max}
		{step}
		{disabled}
		aria-label={label}
		class="ck-range w-full"
		style:--ck-fill="{percent}%"
	/>
</div>

<style>
	.ck-range {
		-webkit-appearance: none;
		appearance: none;
		height: 1.25rem;
		background: transparent;
		cursor: pointer;
	}

	.ck-range:disabled {
		cursor: not-allowed;
	}

	.ck-range::-webkit-slider-runnable-track {
		height: 0.375rem;
		border-radius: 999px;
		background: linear-gradient(
			to right,
			var(--ck-accent) var(--ck-fill),
			var(--ck-muted) var(--ck-fill)
		);
	}

	.ck-range::-moz-range-track {
		height: 0.375rem;
		border-radius: 999px;
		background: linear-gradient(
			to right,
			var(--ck-accent) var(--ck-fill),
			var(--ck-muted) var(--ck-fill)
		);
	}

	.ck-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: -0.3125rem;
		height: 1rem;
		width: 1rem;
		border-radius: 999px;
		background: var(--ck-surface);
		border: 2px solid var(--ck-accent);
		box-shadow: var(--ck-shadow-sm);
		transition: transform 120ms ease-out;
	}

	.ck-range::-moz-range-thumb {
		height: 1rem;
		width: 1rem;
		border-radius: 999px;
		background: var(--ck-surface);
		border: 2px solid var(--ck-accent);
		box-shadow: var(--ck-shadow-sm);
		transition: transform 120ms ease-out;
	}

	.ck-range:not(:disabled):active::-webkit-slider-thumb {
		transform: scale(1.15);
	}

	.ck-range:not(:disabled):active::-moz-range-thumb {
		transform: scale(1.15);
	}

	.ck-range:focus-visible {
		outline: none;
	}

	.ck-range:focus-visible::-webkit-slider-thumb {
		outline: 2px solid var(--ck-ring);
		outline-offset: 2px;
	}

	.ck-range:focus-visible::-moz-range-thumb {
		outline: 2px solid var(--ck-ring);
		outline-offset: 2px;
	}
</style>
