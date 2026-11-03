<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Pixels per second. */
		speed?: number;
		direction?: 'left' | 'right';
		pauseOnHover?: boolean;
		/** Space between items, any CSS length. */
		gap?: string;
		/** Fade the content out toward both edges. */
		fade?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		speed = 40,
		direction = 'left',
		pauseOnHover = true,
		gap = '2.5rem',
		fade = true,
		class: className,
		children
	}: Props = $props();

	let containerWidth = $state(0);
	let trackWidth = $state(0);

	// Enough copies to cover the container twice over, so the loop never shows a gap.
	let copies = $derived(
		trackWidth > 0 ? Math.max(2, Math.ceil(containerWidth / trackWidth) + 1) : 2
	);
	let duration = $derived(trackWidth > 0 ? trackWidth / speed : 20);
</script>

<div
	bind:clientWidth={containerWidth}
	class={cn(
		'ck-marquee flex overflow-hidden',
		fade && 'ck-marquee-fade',
		pauseOnHover && 'ck-marquee-pause',
		className
	)}
	style:--ck-marquee-gap={gap}
	style:--ck-marquee-duration="{duration}s"
>
	{#each { length: copies } as _, index (index)}
		{#if index === 0}
			<div
				bind:clientWidth={trackWidth}
				class="ck-marquee-track"
				class:ck-marquee-reverse={direction === 'right'}
			>
				{@render children()}
			</div>
		{:else}
			<div
				aria-hidden="true"
				class="ck-marquee-track"
				class:ck-marquee-reverse={direction === 'right'}
			>
				{@render children()}
			</div>
		{/if}
	{/each}
</div>

<style>
	.ck-marquee-track {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: var(--ck-marquee-gap);
		padding-right: var(--ck-marquee-gap);
		white-space: nowrap;
		animation: ck-marquee var(--ck-marquee-duration) linear infinite;
	}

	.ck-marquee-reverse {
		animation-direction: reverse;
	}

	.ck-marquee-pause:hover .ck-marquee-track {
		animation-play-state: paused;
	}

	.ck-marquee-fade {
		mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
	}

	@keyframes ck-marquee {
		to {
			transform: translateX(-100%);
		}
	}
</style>
