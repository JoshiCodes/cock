<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<div class={cn('px-2.5 pt-2 pb-1 text-xs font-medium text-fg-subtle', className)}>
	{@render children?.()}
</div>
