<script lang="ts" module>
	export interface MenuContext {
		close: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { MENU } from '../../utils/context.js';
	import { anchored, type Placement } from '../../utils/anchor.js';
	import { clickOutside } from '../../actions/clickOutside.js';
	import { portal } from '../../actions/portal.js';
	import type { TriggerAttrs } from './Popover.svelte';

	interface Props {
		open?: boolean;
		placement?: Placement;
		offset?: number;
		class?: string;
		label?: string;
		trigger: Snippet<[TriggerAttrs]>;
		children: Snippet;
	}

	let {
		open = $bindable(false),
		placement = 'bottom-start',
		offset = 6,
		class: className,
		label = 'Menu',
		trigger,
		children
	}: Props = $props();

	let anchor = $state<HTMLElement | null>(null);
	let menu = $state<HTMLElement | null>(null);

	setContext<MenuContext>(MENU, { close: () => closeAndRestore() });

	function items() {
		return Array.from(
			menu?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []
		);
	}

	function closeAndRestore() {
		open = false;
		anchor?.querySelector<HTMLElement>('button, [role="button"]')?.focus();
	}

	async function toggle() {
		open = !open;
		if (!open) return;
		await tick();
		items()[0]?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		if (!open) return;
		const list = items();
		const index = list.indexOf(document.activeElement as HTMLElement);

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				closeAndRestore();
				break;
			case 'ArrowDown':
				event.preventDefault();
				list[(index + 1) % list.length]?.focus();
				break;
			case 'ArrowUp':
				event.preventDefault();
				list[(index - 1 + list.length) % list.length]?.focus();
				break;
			case 'Home':
				event.preventDefault();
				list[0]?.focus();
				break;
			case 'End':
				event.preventDefault();
				list[list.length - 1]?.focus();
				break;
			case 'Tab':
				open = false;
				break;
		}
	}
</script>

<svelte:window onkeydown={open ? onkeydown : undefined} />

<span bind:this={anchor} class="inline-flex">
	{@render trigger({ onclick: toggle, 'aria-expanded': open, 'aria-haspopup': 'menu' })}
</span>

{#if open}
	<div
		bind:this={menu}
		role="menu"
		aria-label={label}
		tabindex="-1"
		use:portal
		use:anchored={{ to: anchor, placement, offset }}
		use:clickOutside={{ handler: () => (open = false), ignore: [anchor] }}
		transition:scale={{ duration: 130, start: 0.96, opacity: 0 }}
		class={cn(
			'z-50 min-w-52 rounded-lg border border-border bg-surface p-1.5 shadow-lg',
			className
		)}
	>
		{@render children()}
	</div>
{/if}
