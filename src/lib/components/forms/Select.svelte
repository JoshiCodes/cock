<script lang="ts" module>
	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRingInset, transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLSelectAttributes, 'class' | 'value' | 'size'> {
		value?: string;
		/** Pass options, or supply `<option>` elements as children. */
		options?: SelectOption[];
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		options,
		placeholder,
		size = 'md',
		invalid = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const sizes = {
		sm: 'h-8 pl-2.5 pr-8 text-[0.8125rem]',
		md: 'h-9 pl-3 pr-9 text-sm',
		lg: 'h-11 pl-4 pr-10 text-[0.9375rem]'
	};
</script>

<div class={cn('relative flex w-full items-center', className)}>
	<select
		bind:value
		aria-invalid={invalid || undefined}
		class={cn(
			'w-full cursor-pointer appearance-none rounded-md border border-border bg-surface text-fg shadow-xs',
			'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
			transition,
			focusRingInset,
			sizes[size],
			invalid && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25'
		)}
		{...rest}
	>
		{#if placeholder}
			<option value="" disabled hidden>{placeholder}</option>
		{/if}
		{#if options}
			{#each options as option (option.value)}
				<option value={option.value} disabled={option.disabled}>{option.label}</option>
			{/each}
		{:else}
			{@render children?.()}
		{/if}
	</select>

	<svg
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
		class="pointer-events-none absolute right-3 size-4 text-fg-subtle"
	>
		<path
			d="m7 10 5 5 5-5"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</div>
