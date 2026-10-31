<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<code
	class={cn(
		'rounded-md border border-border bg-muted px-[0.35em] py-[0.1em] font-mono text-[0.85em] break-words text-fg',
		className
	)}
>
	{@render children?.()}
</code>
