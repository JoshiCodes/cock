<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRingInset, transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'size'> {
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		/** Icon or text rendered inside, before the input. */
		leading?: Snippet;
		/** Icon, button or text rendered inside, after the input. */
		trailing?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(''),
		size = 'md',
		invalid = false,
		type = 'text',
		leading,
		trailing,
		class: className,
		...rest
	}: Props = $props();

	const sizes = {
		sm: 'h-8 text-[0.8125rem]',
		md: 'h-9 text-sm',
		lg: 'h-11 text-[0.9375rem]'
	};

	const padding = {
		sm: { base: 'px-2.5', leading: 'pl-8', trailing: 'pr-8' },
		md: { base: 'px-3', leading: 'pl-9', trailing: 'pr-9' },
		lg: { base: 'px-4', leading: 'pl-11', trailing: 'pr-11' }
	};

	const affix = {
		sm: 'w-8 text-[0.8125rem]',
		md: 'w-9 text-sm',
		lg: 'w-11 text-base'
	};
</script>

<div class={cn('relative flex w-full items-center', className)}>
	{#if leading}
		<span
			class={cn(
				'pointer-events-none absolute left-0 inline-flex h-full items-center justify-center text-fg-subtle',
				affix[size]
			)}
		>
			{@render leading()}
		</span>
	{/if}

	<input
		{type}
		{value}
		oninput={(event) => (value = event.currentTarget.value)}
		aria-invalid={invalid || undefined}
		class={cn(
			'w-full rounded-md border border-border bg-surface text-fg shadow-xs placeholder:text-fg-subtle',
			'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
			transition,
			focusRingInset,
			sizes[size],
			padding[size].base,
			leading && padding[size].leading,
			trailing && padding[size].trailing,
			invalid && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25'
		)}
		{...rest}
	/>

	{#if trailing}
		<span
			class={cn(
				'absolute right-0 inline-flex h-full items-center justify-center text-fg-subtle',
				affix[size]
			)}
		>
			{@render trailing()}
		</span>
	{/if}
</div>
