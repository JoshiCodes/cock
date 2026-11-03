<script lang="ts">
	import type { Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** A broad marker stroke behind the text, or a line under it. */
		variant?: 'marker' | 'underline';
		/** Any CSS color. Defaults to a translucent accent. */
		color?: string;
		duration?: number;
		delay?: number;
		/** Draw once the text is on screen, or straight away. */
		trigger?: 'visible' | 'mount';
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'marker',
		color,
		duration = 800,
		delay = 0,
		trigger = 'visible',
		class: className,
		children
	}: Props = $props();

	let element = $state<HTMLElement | null>(null);
	let drawn = $state(false);

	$effect(() => {
		if (drawn || !element) return;

		if (prefersReducedMotion.current) {
			drawn = true;
			return;
		}

		if (trigger === 'mount') {
			// One task later, so the empty state is painted and the stroke animates.
			const timer = setTimeout(() => (drawn = true), 30);
			return () => clearTimeout(timer);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				drawn = true;
				observer.disconnect();
			},
			{ threshold: 0.8 }
		);
		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<mark
	bind:this={element}
	class={cn(
		'ck-highlight',
		variant === 'underline' ? 'ck-highlight-underline' : 'ck-highlight-marker',
		drawn && 'ck-highlight-drawn',
		className
	)}
	style:--ck-highlight-color={color}
	style:--ck-highlight-duration="{duration}ms"
	style:--ck-highlight-delay="{delay}ms"
>
	{@render children()}
</mark>

<style>
	.ck-highlight {
		background-color: transparent;
		color: inherit;
		background-repeat: no-repeat;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		padding: 0 0.12em;
		margin: 0 -0.12em;
		border-radius: 0.2em;
		transition: background-size var(--ck-highlight-duration) cubic-bezier(0.3, 0.7, 0.3, 1)
			var(--ck-highlight-delay);
	}

	.ck-highlight-marker {
		--ck-highlight-ink: var(
			--ck-highlight-color,
			color-mix(in oklab, var(--ck-accent) 34%, transparent)
		);
		background-image: linear-gradient(var(--ck-highlight-ink), var(--ck-highlight-ink));
		background-position: 0 88%;
		background-size: 0% 60%;
	}

	.ck-highlight-underline {
		--ck-highlight-ink: var(--ck-highlight-color, var(--ck-accent));
		background-image: linear-gradient(var(--ck-highlight-ink), var(--ck-highlight-ink));
		background-position: 0 100%;
		background-size: 0% 0.12em;
	}

	.ck-highlight-marker.ck-highlight-drawn {
		background-size: 100% 60%;
	}

	.ck-highlight-underline.ck-highlight-drawn {
		background-size: 100% 0.12em;
	}
</style>
