<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRingInset } from '../../utils/styles.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
		/** Which way the content may scroll. */
		orientation?: 'vertical' | 'horizontal' | 'both';
		/** Soft shadows on the edges that still have content behind them. */
		shadows?: boolean;
		/**
		 * Names the region for screen readers. It is focusable while it overflows,
		 * so keyboard users can scroll it, and a focusable region needs a name.
		 */
		label?: string;
		/** Classes for the scrolling element. The outer box takes `class`. */
		viewportClass?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		orientation = 'vertical',
		shadows = true,
		label,
		viewportClass,
		class: className,
		children,
		...rest
	}: Props = $props();

	let viewport = $state<HTMLDivElement>();
	let edges = $state({ top: false, bottom: false, left: false, right: false });

	let overflowing = $derived(edges.top || edges.bottom || edges.left || edges.right);

	function measure() {
		if (!viewport) return;
		const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
			viewport;
		const y = orientation !== 'horizontal';
		const x = orientation !== 'vertical';
		// A pixel of slack, because zoomed pages report fractional scroll positions.
		edges = {
			top: y && scrollTop > 1,
			bottom: y && scrollTop + clientHeight < scrollHeight - 1,
			left: x && scrollLeft > 1,
			right: x && scrollLeft + clientWidth < scrollWidth - 1
		};
	}

	$effect(() => {
		if (!viewport) return;
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		for (const child of viewport.children) observer.observe(child);
		return () => observer.disconnect();
	});

	const overflow = {
		vertical: 'overflow-y-auto overflow-x-hidden',
		horizontal: 'overflow-x-auto overflow-y-hidden',
		both: 'overflow-auto'
	};

	const shadow = 'pointer-events-none absolute transition-opacity duration-150';
</script>

<div class={cn('relative min-h-0 overflow-hidden', className)}>
	<!-- Focusable on purpose: a region that scrolls has to be reachable without a mouse. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={viewport}
		onscroll={measure}
		role={overflowing ? 'region' : undefined}
		aria-label={overflowing ? label : undefined}
		tabindex={overflowing ? 0 : undefined}
		{...rest}
		class={cn(
			'size-full max-h-[inherit] overscroll-contain rounded-[inherit]',
			overflow[orientation],
			'[scrollbar-width:thin] [scrollbar-color:var(--color-border-strong)_transparent]',
			'hover:[scrollbar-color:var(--color-fg-subtle)_transparent]',
			// Safari before 26 only knows the prefixed pseudo-elements.
			'[&::-webkit-scrollbar]:size-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong',
			focusRingInset,
			viewportClass
		)}
	>
		{@render children?.()}
	</div>

	{#if shadows}
		<div
			aria-hidden="true"
			class={cn(shadow, 'inset-x-0 top-0 h-3 bg-linear-to-b from-fg/8', !edges.top && 'opacity-0')}
		></div>
		<div
			aria-hidden="true"
			class={cn(
				shadow,
				'inset-x-0 bottom-0 h-3 bg-linear-to-t from-fg/8',
				!edges.bottom && 'opacity-0'
			)}
		></div>
		<div
			aria-hidden="true"
			class={cn(
				shadow,
				'inset-y-0 left-0 w-3 bg-linear-to-r from-fg/8',
				!edges.left && 'opacity-0'
			)}
		></div>
		<div
			aria-hidden="true"
			class={cn(
				shadow,
				'inset-y-0 right-0 w-3 bg-linear-to-l from-fg/8',
				!edges.right && 'opacity-0'
			)}
		></div>
	{/if}
</div>
