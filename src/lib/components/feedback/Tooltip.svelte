<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { anchored, type Placement } from '../../utils/anchor.js';
	import { portal } from '../../actions/portal.js';

	interface Props {
		content: string;
		placement?: Placement;
		/** Milliseconds to wait before showing. */
		delay?: number;
		class?: string;
		children?: Snippet;
	}

	let { content, placement = 'top', delay = 120, class: className, children }: Props = $props();

	let anchor = $state<HTMLElement | null>(null);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function show() {
		clearTimeout(timer);
		timer = setTimeout(() => (open = true), delay);
	}

	function hide() {
		clearTimeout(timer);
		open = false;
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && hide()} />

<!-- The wrapper only anchors the tooltip; the trigger inside keeps its semantics. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={anchor}
	class="inline-flex"
	onpointerenter={show}
	onpointerleave={hide}
	onfocusin={show}
	onfocusout={hide}
>
	{@render children?.()}
</span>

{#if open}
	<span
		role="tooltip"
		use:portal
		use:anchored={{ to: anchor, placement, offset: 6 }}
		transition:fade={{ duration: 110 }}
		class={cn(
			'pointer-events-none z-60 w-max max-w-xs rounded-md bg-fg px-2 py-1 text-xs font-medium text-bg shadow-md',
			className
		)}
	>
		{content}
	</span>
{/if}
