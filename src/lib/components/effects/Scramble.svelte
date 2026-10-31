<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';

	interface Props {
		text: string;
		/** Total time until every character has settled, in milliseconds. */
		duration?: number;
		/** Characters to cycle through before settling. */
		glyphs?: string;
		/** When to play. Changing `text` always plays it again. */
		trigger?: 'mount' | 'visible' | 'hover';
		class?: string;
	}

	let {
		text,
		duration = 900,
		glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>',
		trigger = 'visible',
		class: className
	}: Props = $props();

	let output = $state('');
	let element = $state<HTMLElement | null>(null);
	let seen = $state(false);
	let frame = 0;

	function play(target: string) {
		cancelAnimationFrame(frame);
		if (prefersReducedMotion.current) {
			output = target;
			return;
		}

		const chars = [...target];
		// Each character settles at its own moment, roughly left to right.
		const settle = chars.map((_, i) => {
			const base = (i / Math.max(1, chars.length)) * duration * 0.6;
			return base + Math.random() * duration * 0.4;
		});
		const start = performance.now();
		let lastSwap = 0;

		const step = (now: number) => {
			const elapsed = now - start;
			// Swap glyphs at ~25 fps; at 60 they turn into noise.
			if (now - lastSwap > 40) {
				lastSwap = now;
				output = chars
					.map((char, i) =>
						char === ' ' || elapsed >= settle[i]
							? char
							: glyphs[Math.floor(Math.random() * glyphs.length)]
					)
					.join('');
			}
			if (elapsed < duration) frame = requestAnimationFrame(step);
			else output = target;
		};

		frame = requestAnimationFrame(step);
	}

	$effect(() => {
		const target = text;
		if (trigger === 'mount' || seen) play(target);
		else output = target;
		return () => cancelAnimationFrame(frame);
	});

	$effect(() => {
		if (trigger !== 'visible' || seen || !element) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				seen = true;
				observer.disconnect();
			},
			{ threshold: 0.6 }
		);
		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={element}
	class={cn('whitespace-pre', className)}
	onpointerenter={trigger === 'hover' ? () => play(text) : undefined}
>
	<span class="sr-only">{text}</span>
	<!-- Falls back to the plain text until the first frame, and on the server. -->
	<span aria-hidden="true">{output || text}</span>
</span>
