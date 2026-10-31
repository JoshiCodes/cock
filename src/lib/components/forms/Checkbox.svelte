<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'checked' | 'type'> {
		checked?: boolean;
		indeterminate?: boolean;
		description?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		description,
		disabled,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<label
	class={cn(
		'group inline-flex items-start gap-2.5',
		disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
		className
	)}
>
	<span class="relative mt-px inline-flex size-[1.125rem] shrink-0">
		<input
			type="checkbox"
			bind:checked
			{indeterminate}
			{disabled}
			class={cn(
				'peer size-full cursor-[inherit] appearance-none rounded-[6px] border border-border-strong bg-surface shadow-xs',
				'checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
				'group-hover:not-disabled:border-border-strong/80',
				transition
			)}
			{...rest}
		/>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 size-full scale-75 text-accent-fg opacity-0 transition peer-checked:scale-100 peer-checked:opacity-100 peer-indeterminate:hidden"
		>
			<path
				d="m6 12.5 4 4 8-9"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 hidden size-full text-accent-fg peer-indeterminate:block"
		>
			<path d="M7 12h10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
		</svg>
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
