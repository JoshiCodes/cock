<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRing, focusRingInset, transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'size' | 'type'> {
		/** `null` while the field is empty, so a blank is not confused with zero. */
		value?: number | null;
		min?: number;
		max?: number;
		step?: number;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		/** Suffix shown inside the field, e.g. a unit. */
		unit?: string;
		class?: string;
	}

	let {
		value = $bindable(null),
		min,
		max,
		step = 1,
		size = 'md',
		invalid = false,
		unit,
		disabled = false,
		readonly = false,
		class: className,
		...rest
	}: Props = $props();

	/**
	 * `type="text"` on purpose. A number input empties itself when a stray letter
	 * lands in it, scrolls to a different value when the wheel passes over, and
	 * reports an empty string for anything it considers invalid, so the component
	 * would never see what was typed.
	 */
	let text = $state(value === null ? '' : String(value));
	let field = $state<HTMLInputElement | null>(null);

	/**
	 * Follow the value when it is set from somewhere else, but never while the
	 * field has focus: `-` and `18.` are on the way to a number and parse to
	 * nothing, so rewriting the text would undo the keystroke that produced them.
	 */
	$effect(() => {
		const incoming = value === null ? '' : String(value);
		if (field !== document.activeElement) text = incoming;
	});

	function parse(input: string): number | null {
		const cleaned = input.replace(',', '.').trim();
		if (cleaned === '' || cleaned === '-' || cleaned.endsWith('.')) return null;
		const parsed = Number(cleaned);
		return Number.isFinite(parsed) ? parsed : null;
	}

	function clamp(next: number): number {
		if (min !== undefined && next < min) return min;
		if (max !== undefined && next > max) return max;
		// Floating point: 0.1 + 0.2 should land on a step, not on 0.30000000000000004.
		return Number(next.toFixed(decimals()));
	}

	/** Decimal places implied by `step`, so 0.25 keeps two and 1 keeps none. */
	function decimals(): number {
		const [, fraction = ''] = String(step).split('.');
		return fraction.length;
	}

	function nudge(by: number) {
		if (disabled || readonly) return;
		const from = value ?? min ?? 0;
		const next = clamp(value === null ? from : from + by);
		value = next;
		text = String(next);
	}

	function oninput(event: Event & { currentTarget: HTMLInputElement }) {
		text = event.currentTarget.value;
		const parsed = parse(text);
		// Clamping while typing would turn "1" into "10" on the way to "100".
		if (parsed !== null || text.trim() === '') value = parsed;
	}

	function onblur() {
		const parsed = parse(text);
		if (parsed === null) {
			value = null;
			text = '';
			return;
		}
		value = clamp(parsed);
		text = String(value);
	}

	function onkeydown(event: KeyboardEvent) {
		const by = {
			ArrowUp: step,
			ArrowDown: -step,
			PageUp: step * 10,
			PageDown: -step * 10
		}[event.key];

		if (by !== undefined) {
			event.preventDefault();
			nudge(by);
			return;
		}

		if (event.key === 'Home' && min !== undefined) {
			event.preventDefault();
			value = min;
			text = String(min);
		}
		if (event.key === 'End' && max !== undefined) {
			event.preventDefault();
			value = max;
			text = String(max);
		}
	}

	let atMin = $derived(min !== undefined && value !== null && value <= min);
	let atMax = $derived(max !== undefined && value !== null && value >= max);

	const sizes = {
		sm: 'h-8 text-[0.8125rem]',
		md: 'h-9 text-sm',
		lg: 'h-11 text-[0.9375rem]'
	};

	const buttons = {
		sm: 'size-6',
		md: 'size-7',
		lg: 'size-9'
	};

	const step_button = cn(
		'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted',
		'hover:bg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-40',
		transition,
		focusRing
	);
</script>

<div
	class={cn(
		'flex items-center gap-1 rounded-md border border-border bg-surface pr-1 pl-1 shadow-xs',
		'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25',
		transition,
		sizes[size],
		disabled && 'cursor-not-allowed bg-muted opacity-60',
		invalid && 'border-danger focus-within:border-danger focus-within:ring-danger/25',
		className
	)}
>
	<button
		type="button"
		tabindex={-1}
		aria-label="Decrease"
		disabled={disabled || readonly || atMin}
		onclick={() => nudge(-step)}
		class={cn(step_button, buttons[size])}
	>
		<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
			<path d="M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
		</svg>
	</button>

	<input
		bind:this={field}
		type="text"
		inputmode="decimal"
		role="spinbutton"
		value={text}
		{disabled}
		{readonly}
		aria-valuenow={value ?? undefined}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-invalid={invalid || undefined}
		{oninput}
		{onblur}
		{onkeydown}
		class={cn(
			'w-full min-w-0 bg-transparent text-center text-fg tabular-nums outline-none',
			'placeholder:text-fg-subtle disabled:cursor-not-allowed',
			focusRingInset,
			'focus-visible:ring-0'
		)}
		{...rest}
	/>

	{#if unit}
		<span class="shrink-0 pr-0.5 text-xs text-fg-subtle">{unit}</span>
	{/if}

	<button
		type="button"
		tabindex={-1}
		aria-label="Increase"
		disabled={disabled || readonly || atMax}
		onclick={() => nudge(step)}
		class={cn(step_button, buttons[size])}
	>
		<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
			<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
		</svg>
	</button>
</div>
