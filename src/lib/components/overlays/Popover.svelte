<script lang="ts" module>
	export interface TriggerAttrs {
		onclick: (event: MouseEvent) => void;
		'aria-expanded': boolean;
		'aria-haspopup': 'dialog' | 'menu';
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { anchored, type Placement } from '../../utils/anchor.js';
	import { clickOutside } from '../../actions/clickOutside.js';
	import { portal } from '../../actions/portal.js';

	interface Props {
		open?: boolean;
		placement?: Placement;
		offset?: number;
		class?: string;
		/** Spread the given attrs onto your own button. */
		trigger: Snippet<[TriggerAttrs]>;
		children: Snippet<[{ close: () => void }]>;
	}

	let {
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 8,
		class: className,
		trigger,
		children
	}: Props = $props();

	let anchor = $state<HTMLElement | null>(null);

	function close() {
		open = false;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !open) return;
		event.stopPropagation();
		close();
		anchor?.querySelector<HTMLElement>('button, [role="button"]')?.focus();
	}
</script>

<svelte:window onkeydown={open ? onkeydown : undefined} />

<span bind:this={anchor} class="inline-flex">
	{@render trigger({
		onclick: () => (open = !open),
		'aria-expanded': open,
		'aria-haspopup': 'dialog'
	})}
</span>

{#if open}
	<div
		use:portal
		use:anchored={{ to: anchor, placement, offset }}
		use:clickOutside={{ handler: close, ignore: [anchor] }}
		transition:scale={{ duration: 130, start: 0.96, opacity: 0 }}
		class={cn('z-50 min-w-56 rounded-lg border border-border bg-surface p-4 shadow-lg', className)}
	>
		{@render children({ close })}
	</div>
{/if}
