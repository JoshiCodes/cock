<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { RESIZABLE, requireContext } from '../../utils/context.js';
	import type { ResizableContext } from './Resizable.svelte';

	interface Props {
		/** Shows a small grip in the middle of the line. */
		grip?: boolean;
		/** Names the handle for screen readers. */
		label?: string;
		class?: string;
	}

	let { grip = false, label = 'Resize', class: className }: Props = $props();

	const group = requireContext<ResizableContext>(RESIZABLE, 'ResizableHandle', 'Resizable');
	/** The panel before this handle. */
	const index = group.count - 1;

	let handle = $state<HTMLDivElement>();
	let dragging = $state(false);
	let start = { pointer: 0, size: 0, perPixel: 0 };

	let horizontal = $derived(group.direction === 'horizontal');

	function onpointerdown(event: PointerEvent) {
		const before = handle?.previousElementSibling?.getBoundingClientRect();
		const after = handle?.nextElementSibling?.getBoundingClientRect();
		if (!before || !after) return;
		event.preventDefault();
		handle?.setPointerCapture(event.pointerId);
		handle?.focus();

		// Pixels to percent, measured on the two panels this handle sits between.
		const pixels = horizontal ? before.width + after.width : before.height + after.height;
		const percent = group.size(index) + group.size(index + 1);
		start = {
			pointer: horizontal ? event.clientX : event.clientY,
			size: group.size(index),
			perPixel: pixels ? percent / pixels : 0
		};
		dragging = true;
	}

	function onpointermove(event: PointerEvent) {
		if (!dragging) return;
		const moved = (horizontal ? event.clientX : event.clientY) - start.pointer;
		group.resize(index, start.size + moved * start.perPixel - group.size(index));
	}

	function onkeydown(event: KeyboardEvent) {
		const back = horizontal ? 'ArrowLeft' : 'ArrowUp';
		const forward = horizontal ? 'ArrowRight' : 'ArrowDown';
		const moves: Record<string, number> = {
			[back]: -5,
			[forward]: 5,
			Home: -100,
			End: 100
		};
		const delta = moves[event.key];
		if (delta === undefined) return;
		event.preventDefault();
		group.resize(index, delta);
	}
</script>

<!-- A focusable separator is the ARIA pattern for a splitter. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
	bind:this={handle}
	role="separator"
	tabindex="0"
	aria-label={label}
	aria-orientation={horizontal ? 'vertical' : 'horizontal'}
	aria-valuenow={Math.round(group.size(index))}
	aria-valuemin={0}
	aria-valuemax={100}
	{onpointerdown}
	{onpointermove}
	onpointerup={() => (dragging = false)}
	onpointercancel={() => (dragging = false)}
	{onkeydown}
	class={cn(
		'group relative flex shrink-0 touch-none items-center justify-center bg-border outline-none',
		'transition-colors hover:bg-accent focus-visible:bg-accent',
		dragging && 'bg-accent',
		// One pixel to see, a wider strip to grab.
		horizontal
			? 'w-px cursor-col-resize after:absolute after:-inset-x-1.5 after:inset-y-0'
			: 'h-px cursor-row-resize after:absolute after:inset-x-0 after:-inset-y-1.5',
		className
	)}
>
	{#if grip}
		<span
			aria-hidden="true"
			class={cn(
				'z-10 rounded-full border border-border bg-surface shadow-xs',
				horizontal ? 'h-6 w-2' : 'h-2 w-6'
			)}
		></span>
	{/if}
</div>
