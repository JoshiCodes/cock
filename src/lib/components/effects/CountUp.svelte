<script lang="ts">
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';

	interface Props {
		value: number;
		/** Milliseconds per run. */
		duration?: number;
		decimals?: number;
		locale?: string;
		/** Custom formatting; overrides `decimals` and `locale`. */
		format?: (value: number) => string;
		prefix?: string;
		suffix?: string;
		/** Wait until the number scrolls into view before counting. */
		startOnView?: boolean;
		class?: string;
	}

	let {
		value,
		duration = 1200,
		decimals = 0,
		locale,
		format,
		prefix = '',
		suffix = '',
		startOnView = true,
		class: className
	}: Props = $props();

	let element = $state<HTMLElement | null>(null);
	let started = $state(false);
	let current = $state(0);
	let frame = 0;

	let formatter = $derived(
		new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})
	);

	function render(n: number) {
		return prefix + (format ? format(n) : formatter.format(n)) + suffix;
	}

	$effect(() => {
		if (!startOnView) {
			started = true;
			return;
		}
		if (started || !element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				started = true;
				observer.disconnect();
			},
			{ threshold: 0.4 }
		);
		observer.observe(element);
		return () => observer.disconnect();
	});

	$effect(() => {
		const target = value;
		if (!started) return;

		if (prefersReducedMotion.current) {
			current = target;
			return;
		}

		const from = untrack(() => current);
		const start = performance.now();

		const step = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - t) ** 3;
			current = from + (target - from) * eased;
			if (t < 1) frame = requestAnimationFrame(step);
		};

		frame = requestAnimationFrame(step);
		return () => cancelAnimationFrame(frame);
	});
</script>

<span bind:this={element} class={cn('tabular-nums', className)}>
	<span class="sr-only">{render(value)}</span>
	<span aria-hidden="true">{render(current)}</span>
</span>
