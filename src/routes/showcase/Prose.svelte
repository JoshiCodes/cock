<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '@joshicodes/cock';

	/** Shared rhythm for the guide pages, so headings and spacing match everywhere. */
	let { class: className, children }: { class?: string; children: Snippet } = $props();
</script>

<div
	class={cn(
		'max-w-3xl py-10 lg:py-14',
		'[&_h2]:mt-14 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-fg',
		'[&_h3]:mt-10 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-fg',
		'[&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-fg-muted',
		'[&_li]:leading-relaxed [&_li]:text-fg-muted [&_ul]:mt-4 [&_ul]:space-y-2',
		'[&_a:not([class])]:text-accent [&_a:not([class])]:underline [&_a:not([class])]:underline-offset-4',
		className
	)}
>
	{@render children()}
</div>
