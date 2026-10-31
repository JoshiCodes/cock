<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRingInset, transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value'> {
		value?: string;
		invalid?: boolean;
		/** Grow with the content instead of scrolling. */
		autosize?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		invalid = false,
		autosize = false,
		rows = 4,
		class: className,
		...rest
	}: Props = $props();

	let element = $state<HTMLTextAreaElement | null>(null);

	$effect(() => {
		if (!autosize || !element) return;
		// Touch `value` so this re-runs on every keystroke.
		value;
		element.style.height = 'auto';
		element.style.height = `${element.scrollHeight}px`;
	});
</script>

<textarea
	bind:this={element}
	{rows}
	{value}
	oninput={(event) => (value = event.currentTarget.value)}
	aria-invalid={invalid || undefined}
	class={cn(
		'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg shadow-xs placeholder:text-fg-subtle',
		'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60',
		autosize ? 'resize-none overflow-hidden' : 'resize-y',
		transition,
		focusRingInset,
		invalid && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25',
		className
	)}
	{...rest}></textarea>
