<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		title: string;
		/** When it happened, as you want it shown. Pass `datetime` for machines. */
		time?: string;
		/** An ISO date for the `<time>` element, so it is machine-readable too. */
		datetime?: string;
		tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
		/** Replaces the dot, e.g. with a small icon. */
		icon?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let {
		title,
		time,
		datetime,
		tone = 'neutral',
		icon,
		class: className,
		children
	}: Props = $props();

	const tones = {
		neutral: 'border-border-strong bg-surface text-fg-muted',
		accent: 'border-accent bg-accent text-accent-fg',
		success: 'border-success bg-success text-white dark:text-bg',
		warning: 'border-warning bg-warning text-white dark:text-bg',
		danger: 'border-danger bg-danger text-white dark:text-bg'
	};
</script>

<li class={cn('group relative flex gap-4 pb-7 last:pb-0', className)}>
	<!-- The line runs from under this marker to the next one, and stops at the last. -->
	<span
		aria-hidden="true"
		class="absolute top-7 bottom-1 left-[0.6875rem] w-px bg-border group-last:hidden"
	></span>

	<span
		aria-hidden="true"
		class={cn(
			'relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border [&>svg]:size-3.5',
			icon ? tones[tone] : 'border-transparent'
		)}
	>
		{#if icon}
			{@render icon()}
		{:else}
			<span class={cn('size-2.5 rounded-full border-2', tones[tone])}></span>
		{/if}
	</span>

	<div class="min-w-0 flex-1 pt-0.5">
		<div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
			<p class="text-sm font-medium text-fg">{title}</p>
			{#if time}
				<time {datetime} class="text-xs text-fg-subtle tabular-nums">{time}</time>
			{/if}
		</div>
		{#if children}
			<div class="mt-1 text-sm leading-relaxed text-fg-muted">{@render children()}</div>
		{/if}
	</div>
</li>
