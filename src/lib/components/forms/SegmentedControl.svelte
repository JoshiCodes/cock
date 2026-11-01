<script lang="ts" module>
	export interface SegmentedOption {
		value: string;
		label: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';

	interface Props {
		value?: string;
		options: SegmentedOption[];
		size?: 'sm' | 'md';
		disabled?: boolean;
		/** Names the group for screen readers. Skip it inside a `<Field>`. */
		label?: string;
		/** Stretch the segments to fill the width instead of hugging their text. */
		stretch?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		options,
		size = 'md',
		disabled = false,
		label,
		stretch = false,
		class: className
	}: Props = $props();

	let group = $state<HTMLElement | null>(null);

	let selectable = $derived(options.filter((option) => !option.disabled));

	/**
	 * A radio group is one stop in the tab order; the arrows move within it. The
	 * keys select as they go, which is what a radio group is supposed to do and
	 * what makes this different from `Tabs`.
	 */
	function onkeydown(event: KeyboardEvent) {
		if (disabled || selectable.length === 0) return;

		const index = selectable.findIndex((option) => option.value === value);
		const next = {
			ArrowRight: (index + 1) % selectable.length,
			ArrowDown: (index + 1) % selectable.length,
			ArrowLeft: (index - 1 + selectable.length) % selectable.length,
			ArrowUp: (index - 1 + selectable.length) % selectable.length,
			Home: 0,
			End: selectable.length - 1
		}[event.key];

		if (next === undefined) return;
		event.preventDefault();
		value = selectable[next].value;
		group?.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`)?.focus();
	}

	const sizes = {
		sm: 'h-7 px-2.5 text-xs',
		md: 'h-8 px-3 text-sm'
	};
</script>

<div
	bind:this={group}
	role="radiogroup"
	aria-label={label}
	aria-disabled={disabled || undefined}
	{onkeydown}
	tabindex={-1}
	class={cn(
		'inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5',
		stretch && 'flex w-full',
		disabled && 'opacity-60',
		className
	)}
>
	{#each options as option (option.value)}
		{@const selected = option.value === value}
		<button
			type="button"
			role="radio"
			data-value={option.value}
			aria-checked={selected}
			disabled={disabled || option.disabled}
			tabindex={selected || (!value && option === selectable[0]) ? 0 : -1}
			onclick={() => (value = option.value)}
			class={cn(
				'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap',
				'disabled:cursor-not-allowed disabled:opacity-50',
				transition,
				focusRing,
				sizes[size],
				stretch && 'flex-1',
				selected ? 'bg-surface text-fg shadow-xs' : 'text-fg-muted hover:text-fg'
			)}
		>
			{option.label}
		</button>
	{/each}
</div>
