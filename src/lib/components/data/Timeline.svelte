<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		/** `TimelineItem`s, newest or oldest first; the order is yours. */
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<ol class={cn('flex flex-col', className)}>
	{@render children?.()}
</ol>
