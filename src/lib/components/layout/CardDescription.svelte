<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<p class={cn('text-sm leading-relaxed text-fg-muted', className)}>
	{@render children?.()}
</p>
