<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		/** Optional label rendered in the middle of a horizontal rule. */
		children?: Snippet;
	}

	let { orientation = 'horizontal', class: className, children }: Props = $props();
</script>

{#if children && orientation === 'horizontal'}
	<div class={cn('flex items-center gap-3', className)}>
		<span class="h-px flex-1 bg-border"></span>
		<span class="text-xs text-fg-subtle">
			{@render children()}
		</span>
		<span class="h-px flex-1 bg-border"></span>
	</div>
{:else}
	<div
		role="separator"
		aria-orientation={orientation}
		class={cn(
			'shrink-0 bg-border',
			orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
			className
		)}
	></div>
{/if}
