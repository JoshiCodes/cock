<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Milliseconds before the transition starts; use it to stagger siblings. */
		delay?: number;
		duration?: number;
		/** How far the content travels up, in pixels. */
		distance?: number;
		/** Reveal once, or hide again whenever it leaves the viewport. */
		once?: boolean;
		/** Share of the element that must be visible to trigger. */
		threshold?: number;
		/** Play the entrance even when the element is already on screen at mount. */
		appear?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		delay = 0,
		duration = 500,
		distance = 14,
		once = true,
		threshold = 0.15,
		appear = false,
		class: className,
		children
	}: Props = $props();

	let element = $state<HTMLElement | null>(null);
	// `idle` means "leave it alone": content is visible before JS runs, and
	// anything already on screen at mount never gets hidden.
	let phase = $state<'idle' | 'hidden' | 'shown'>('idle');

	$effect(() => {
		if (!element || prefersReducedMotion.current) return;
		if (!appear && element.getBoundingClientRect().top < window.innerHeight) return;

		phase = 'hidden';
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					phase = 'shown';
					if (once) observer.disconnect();
				} else if (!once) {
					phase = 'hidden';
				}
			},
			{ threshold }
		);
		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class={cn(
		phase !== 'idle' && 'transition-[opacity,translate] ease-out',
		phase === 'hidden' && 'opacity-0',
		className
	)}
	style:transition-duration={phase === 'idle' ? undefined : `${duration}ms`}
	style:transition-delay={phase === 'shown' ? `${delay}ms` : undefined}
	style:translate={phase === 'hidden' ? `0 ${distance}px` : undefined}
>
	{@render children()}
</div>
