<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		actions?: Snippet;
		class?: string;
	}

	let { title, description, icon, actions, class: className }: Props = $props();
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center',
		className
	)}
>
	<span class="text-fg-subtle">
		{#if icon}
			{@render icon()}
		{:else}
			<svg viewBox="0 0 24 24" fill="none" class="size-8" aria-hidden="true">
				<rect
					x="3.5"
					y="5"
					width="17"
					height="14"
					rx="2.5"
					stroke="currentColor"
					stroke-width="1.5"
				/>
				<path d="M3.5 10h17" stroke="currentColor" stroke-width="1.5" />
			</svg>
		{/if}
	</span>

	<div class="space-y-1">
		<p class="text-sm font-semibold text-fg">{title}</p>
		{#if description}
			<p class="mx-auto max-w-sm text-sm leading-relaxed text-fg-muted">{description}</p>
		{/if}
	</div>

	{#if actions}
		<div class="mt-1 flex items-center gap-2">{@render actions()}</div>
	{/if}
</div>
