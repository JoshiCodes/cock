<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';

	interface Props {
		for?: string;
		required?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { for: htmlFor, required = false, class: className, children }: Props = $props();
</script>

<label for={htmlFor} class={cn('text-sm leading-none font-medium text-fg', className)}>
	{@render children?.()}
	{#if required}
		<span class="text-danger" aria-hidden="true">*</span>
	{/if}
</label>
