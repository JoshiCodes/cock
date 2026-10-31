<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<h3 class={cn('text-[0.9375rem] leading-tight font-semibold tracking-tight text-fg', className)}>
	{@render children?.()}
</h3>
