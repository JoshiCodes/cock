<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		/** Convenience for text placeholders: renders N stacked lines. */
		lines?: number;
	}

	let { class: className, lines }: Props = $props();
</script>

{#if lines}
	<div class="flex w-full flex-col gap-2">
		{#each { length: lines } as _, i (i)}
			<div
				class={cn(
					'h-3.5 animate-pulse rounded-md bg-muted',
					i === lines - 1 ? 'w-2/3' : 'w-full',
					className
				)}
			></div>
		{/each}
	</div>
{:else}
	<div class={cn('animate-pulse rounded-md bg-muted', className)}></div>
{/if}
