<script lang="ts" module>
	export interface CarouselContext {
		/** Adds a slide in document order and returns its index. */
		register: () => number;
		readonly total: number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import { CAROUSEL } from '../../utils/context.js';

	interface Props {
		/** Index of the slide in view, from 0. */
		current?: number;
		/** Names the carousel for screen readers. */
		label: string;
		/** Moves on by itself every this many milliseconds. 0 turns it off. */
		autoplay?: number;
		/** After the last slide, Next goes back to the first. */
		loop?: boolean;
		/** Dots under the slides, one per slide. */
		dots?: boolean;
		class?: string;
		/** `CarouselSlide`s. */
		children?: Snippet;
	}

	let {
		current = $bindable(0),
		label,
		autoplay = 0,
		loop = false,
		dots = true,
		class: className,
		children
	}: Props = $props();

	const id = uid('carousel');

	let total = $state(0);
	let track = $state<HTMLDivElement>();
	let paused = $state(false);
	let hovering = $state(false);
	let focused = $state(false);

	setContext<CarouselContext>(CAROUSEL, {
		register: () => total++,
		get total() {
			return total;
		}
	});

	const reducedMotion = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function slides() {
		return Array.from(track?.children ?? []) as HTMLElement[];
	}

	function go(index: number) {
		const target = loop ? (index + total) % total : Math.min(total - 1, Math.max(0, index));
		const slide = slides()[target];
		if (!track || !slide) return;
		track.scrollTo({
			left: slide.offsetLeft - track.offsetLeft,
			behavior: reducedMotion() ? 'auto' : 'smooth'
		});
		current = target;
	}

	/** Whichever slide's left edge is closest to the track's, after a swipe or scroll. */
	let frame = 0;
	function onscroll() {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			if (!track) return;
			let best = 0;
			let distance = Infinity;
			slides().forEach((slide, index) => {
				const gap = Math.abs(slide.offsetLeft - track!.offsetLeft - track!.scrollLeft);
				if (gap < distance) [best, distance] = [index, gap];
			});
			current = best;
		});
	}

	// Rotation stops while someone is reading or interacting, and for good when they asked
	// the system for less motion.
	let rotating = $derived(autoplay > 0 && !paused && !hovering && !focused && total > 1);

	$effect(() => {
		if (!rotating || reducedMotion()) return;
		const timer = setInterval(() => go(current + 1 >= total ? 0 : current + 1), autoplay);
		return () => clearInterval(timer);
	});

	let atStart = $derived(!loop && current <= 0);
	let atEnd = $derived(!loop && current >= total - 1);

	const control = cn(
		'inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-fg-muted shadow-xs hover:bg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-40',
		transition,
		focusRing
	);
</script>

<section
	aria-roledescription="carousel"
	aria-label={label}
	onpointerenter={() => (hovering = true)}
	onpointerleave={() => (hovering = false)}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
	class={cn('space-y-3', className)}
>
	<div
		bind:this={track}
		id="{id}-track"
		{onscroll}
		aria-live={rotating ? 'off' : 'polite'}
		class="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
	>
		{@render children?.()}
	</div>

	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-2">
			<button
				type="button"
				aria-label="Previous slide"
				aria-controls="{id}-track"
				disabled={atStart}
				onclick={() => go(current - 1)}
				class={control}
			>
				<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
					<path
						d="m14 7-5 5 5 5"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				type="button"
				aria-label="Next slide"
				aria-controls="{id}-track"
				disabled={atEnd}
				onclick={() => go(current + 1)}
				class={control}
			>
				<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
					<path
						d="m10 7 5 5-5 5"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			{#if autoplay > 0}
				<button
					type="button"
					aria-label={paused ? 'Start rotation' : 'Stop rotation'}
					onclick={() => (paused = !paused)}
					class={control}
				>
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5" aria-hidden="true">
						{#if paused}
							<path d="M8 5.5v13l10.5-6.5z" />
						{:else}
							<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
						{/if}
					</svg>
				</button>
			{/if}
		</div>

		{#if dots && total > 1}
			<div class="flex items-center gap-1.5">
				{#each { length: total }, index (index)}
					<button
						type="button"
						aria-label="Go to slide {index + 1}"
						aria-current={index === current ? 'true' : undefined}
						onclick={() => go(index)}
						class={cn(
							'h-2 cursor-pointer rounded-full',
							transition,
							focusRing,
							index === current ? 'w-5 bg-accent' : 'w-2 bg-border-strong hover:bg-fg-subtle'
						)}
					></button>
				{/each}
			</div>
		{/if}
	</div>
</section>
