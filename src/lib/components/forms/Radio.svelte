<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';
	import { RADIO_GROUP, requireContext } from '../../utils/context.js';
	import type { RadioGroupContext } from './RadioGroup.svelte';

	interface Props {
		value: string;
		description?: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { value, description, disabled = false, class: className, children }: Props = $props();

	const group = requireContext<RadioGroupContext>(RADIO_GROUP, 'Radio', 'RadioGroup');

	let isDisabled = $derived(disabled || group.disabled);
	let checked = $derived(group.value === value);
</script>

<label
	class={cn(
		'group inline-flex items-start gap-2.5',
		isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
		className
	)}
>
	<span class="relative mt-px inline-flex size-[1.125rem] shrink-0">
		<input
			type="radio"
			name={group.name}
			{value}
			{checked}
			disabled={isDisabled}
			onchange={() => group.select(value)}
			class={cn(
				'peer size-full cursor-[inherit] appearance-none rounded-full border border-border-strong bg-surface shadow-xs',
				'checked:border-accent checked:bg-accent',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
				transition
			)}
		/>
		<span
			class="pointer-events-none absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-accent-fg transition-transform peer-checked:scale-100"
		></span>
	</span>

	{#if children || description}
		<span class="min-w-0 space-y-0.5">
			{#if children}
				<span class="block text-sm leading-tight font-medium text-fg">{@render children()}</span>
			{/if}
			{#if description}
				<span class="block text-xs leading-relaxed text-fg-muted">{description}</span>
			{/if}
		</span>
	{/if}
</label>
