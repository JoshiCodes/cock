<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<kbd
	class={cn(
		'inline-flex h-5 min-w-5 items-center justify-center rounded border border-b-2 border-border bg-surface px-1.5 font-mono text-[0.6875rem] font-medium text-fg-muted',
		className
	)}
>
	{@render children?.()}
</kbd>
