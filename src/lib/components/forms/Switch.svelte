<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import { focusRing, transition } from '../../utils/styles.js';

	interface Props {
		checked?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md';
		description?: string;
		/** Put the label before the switch instead of after it. */
		labelPosition?: 'start' | 'end';
		class?: string;
		children?: Snippet;
		/** Needed when the switch has no visible label. */
		'aria-label'?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		description,
		labelPosition = 'end',
		class: className,
		children,
		'aria-label': ariaLabel,
		onchange
	}: Props = $props();

	const labelId = uid('switch-label');

	const sizes = {
		sm: { track: 'h-5 w-9', knob: 'size-4', travel: 'translate-x-4' },
		md: { track: 'h-6 w-11', knob: 'size-5', travel: 'translate-x-5' }
	};

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<label
	class={cn(
		'inline-flex items-center gap-3',
		labelPosition === 'start' && 'flex-row-reverse justify-between',
		disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
		className
	)}
>
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-labelledby={children ? labelId : undefined}
		aria-label={children ? undefined : ariaLabel}
		{disabled}
		onclick={toggle}
		class={cn(
			'relative inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5',
			'cursor-[inherit]',
			checked ? 'bg-accent' : 'bg-border-strong',
			transition,
			focusRing,
			sizes[size].track
		)}
	>
		<span
			class={cn(
				'pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-out',
				sizes[size].knob,
				checked ? sizes[size].travel : 'translate-x-0'
			)}
		></span>
	</button>

	{#if children || description}
		<span class="min-w-0 space-y-0.5">
			{#if children}
				<span id={labelId} class="block text-sm leading-tight font-medium text-fg">
					{@render children()}
				</span>
			{/if}
			{#if description}
				<span class="block text-xs leading-relaxed text-fg-muted">{description}</span>
			{/if}
		</span>
	{/if}
</label>
