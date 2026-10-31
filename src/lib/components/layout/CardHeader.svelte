<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Draw a hairline under the header. */
		divided?: boolean;
		class?: string;
		children?: Snippet;
		/** Right-aligned slot for actions. */
		actions?: Snippet;
	}

	let { divided = false, class: className, children, actions }: Props = $props();
</script>

<div
	class={cn(
		'flex items-start justify-between gap-4 p-5',
		divided && 'border-b border-border',
		className
	)}
>
	<div class="min-w-0 space-y-1">
		{@render children?.()}
	</div>
	{#if actions}
		<div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
	{/if}
</div>
