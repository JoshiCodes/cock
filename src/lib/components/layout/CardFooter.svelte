<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		divided?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { divided = true, class: className, children }: Props = $props();
</script>

<div
	class={cn(
		'flex items-center gap-2 p-5',
		divided && 'rounded-b-lg border-t border-border bg-muted/40',
		className
	)}
>
	{@render children?.()}
</div>
