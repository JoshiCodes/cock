<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';

	interface Props {
		value?: number;
		max?: number;
		/** Display only. Fractions are drawn, so 3.6 shows three and a bit. */
		readonly?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Names the group for screen readers. */
		label?: string;
		/** Submits the value with a form. */
		name?: string;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(0),
		max = 5,
		readonly = false,
		disabled = false,
		size = 'md',
		label = 'Rating',
		name = uid('rating'),
		class: className,
		onchange
	}: Props = $props();

	let hovered = $state<number | null>(null);
	let shown = $derived(hovered ?? value);

	const sizes = { sm: 'size-4', md: 'size-5', lg: 'size-7' };
	const star = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z';

	function choose(next: number) {
		// Choosing the current value again clears it, which radios cannot do on their own.
		value = next === value ? 0 : next;
		onchange?.(value);
	}

	/** How much of star `n` (from 1) is filled, from 0 to 1. */
	const fill = (n: number) => Math.min(1, Math.max(0, shown - (n - 1)));
</script>

{#snippet icon(n: number)}
	<svg viewBox="0 0 24 24" aria-hidden="true" class={cn(sizes[size], 'shrink-0')}>
		<defs>
			<clipPath id="{name}-clip-{n}">
				<rect width={24 * fill(n)} height="24" />
			</clipPath>
		</defs>
		<path
			d={star}
			class="fill-border stroke-border-strong"
			stroke-width="1"
			stroke-linejoin="round"
		/>
		<path
			d={star}
			clip-path="url(#{name}-clip-{n})"
			class="fill-warning stroke-warning"
			stroke-width="1"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#if readonly}
	<span
		role="img"
		aria-label="{label}: {+value.toFixed(1)} out of {max}"
		class={cn('inline-flex items-center gap-0.5', className)}
	>
		{#each { length: max }, i (i)}
			{@render icon(i + 1)}
		{/each}
	</span>
{:else}
	<fieldset
		{disabled}
		onpointerleave={() => (hovered = null)}
		class={cn('inline-flex items-center gap-0.5 disabled:opacity-50', className)}
	>
		<legend class="sr-only">{label}</legend>
		{#each { length: max }, i (i)}
			{@const n = i + 1}
			<label
				class="group relative cursor-pointer rounded-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
				onpointerenter={() => !disabled && (hovered = n)}
			>
				<input
					type="radio"
					{name}
					value={n}
					checked={value === n}
					onclick={() => choose(n)}
					class="peer sr-only"
				/>
				<span class="sr-only">{n} {n === 1 ? 'star' : 'stars'}</span>
				{@render icon(n)}
			</label>
		{/each}
	</fieldset>
{/if}
