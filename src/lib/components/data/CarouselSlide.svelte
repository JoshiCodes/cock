<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { CAROUSEL, requireContext } from '../../utils/context.js';
	import type { CarouselContext } from './Carousel.svelte';

	interface Props {
		/** Width classes go here: `basis-1/2` shows two at a time. */
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	const carousel = requireContext<CarouselContext>(CAROUSEL, 'CarouselSlide', 'Carousel');
	const index = carousel.register();
</script>

<div
	role="group"
	aria-roledescription="slide"
	aria-label="{index + 1} of {carousel.total}"
	class={cn('min-w-0 shrink-0 grow-0 basis-full snap-start', className)}
>
	{@render children?.()}
</div>
