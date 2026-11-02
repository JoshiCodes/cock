<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { RESIZABLE, requireContext } from '../../utils/context.js';
	import type { ResizableContext } from './Resizable.svelte';

	interface Props {
		/** Starting size in percent. Panels without one share the rest. */
		size?: number;
		/** Smallest size in percent. */
		min?: number;
		/** Largest size in percent. */
		max?: number;
		class?: string;
		children?: Snippet;
	}

	let { size, min = 10, max = 90, class: className, children }: Props = $props();

	const group = requireContext<ResizableContext>(RESIZABLE, 'ResizablePanel', 'Resizable');
	// Registered once, in document order; later prop changes are not picked up.
	// svelte-ignore state_referenced_locally
	const index = group.register({ size, min, max });
</script>

<!-- Grow factors rather than percentages, so the handles' own width is never counted. -->
<div
	class={cn('min-h-0 min-w-0 basis-0 overflow-auto', className)}
	style:flex-grow={group.size(index)}
>
	{@render children?.()}
</div>
