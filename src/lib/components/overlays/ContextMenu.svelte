<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setContext, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { MENU } from '../../utils/context.js';
	import { clickOutside } from '../../actions/clickOutside.js';
	import { portal } from '../../actions/portal.js';
	import type { MenuContext } from './DropdownMenu.svelte';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
		open?: boolean;
		/** Lets the browser's own menu through, e.g. while editing text. */
		disabled?: boolean;
		label?: string;
		/** Classes for the menu panel. The region takes `class`. */
		menuClass?: string;
		class?: string;
		/** The area that answers to a right click. */
		children: Snippet;
		/** The items: `MenuItem`, `MenuLabel` and `MenuSeparator`. */
		menu: Snippet;
	}

	let {
		open = $bindable(false),
		disabled = false,
		label = 'Context menu',
		menuClass,
		class: className,
		children,
		menu,
		...rest
	}: Props = $props();

	let panel = $state<HTMLElement | null>(null);
	let point = $state({ x: 0, y: 0 });
	/** Whatever had focus before, so closing can hand it back. */
	let returnTo: HTMLElement | null = null;

	setContext<MenuContext>(MENU, { close: () => closeAndRestore() });

	function items() {
		return Array.from(
			panel?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []
		);
	}

	async function oncontextmenu(event: MouseEvent) {
		if (disabled) return;
		event.preventDefault();

		// Shift+F10 and the menu key fire this too, with no pointer to go by.
		const keyboard = event.clientX === 0 && event.clientY === 0;
		const target = event.target as HTMLElement;
		const box = target.getBoundingClientRect();
		point = keyboard ? { x: box.left, y: box.bottom } : { x: event.clientX, y: event.clientY };

		returnTo = document.activeElement as HTMLElement | null;
		open = true;
		await tick();
		place();
		(keyboard ? items()[0] : panel)?.focus();
	}

	/** Open at the pointer, but slide back in rather than run off the edge. */
	function place() {
		if (!panel) return;
		const gap = 8;
		const x = Math.min(point.x, window.innerWidth - panel.offsetWidth - gap);
		const y =
			point.y + panel.offsetHeight + gap > window.innerHeight
				? point.y - panel.offsetHeight
				: point.y;
		panel.style.left = `${Math.max(gap, x)}px`;
		panel.style.top = `${Math.max(gap, y)}px`;
	}

	function close() {
		open = false;
	}

	function closeAndRestore() {
		close();
		returnTo?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
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
				close();
				break;
		}
	}
</script>

<svelte:window
	onkeydown={open ? onkeydown : undefined}
	onscroll={open ? close : undefined}
	onresize={open ? close : undefined}
	onblur={open ? close : undefined}
/>

<div {...rest} {oncontextmenu} class={className}>
	{@render children()}
</div>

{#if open}
	<div
		bind:this={panel}
		role="menu"
		aria-label={label}
		tabindex="-1"
		use:portal
		use:clickOutside={{ handler: close }}
		oncontextmenu={(event) => event.preventDefault()}
		transition:scale={{ duration: 110, start: 0.97, opacity: 0 }}
		style:left="{point.x}px"
		style:top="{point.y}px"
		class={cn(
			'fixed z-50 min-w-52 origin-top-left rounded-lg border border-border bg-surface p-1.5 shadow-lg outline-none',
			menuClass
		)}
	>
		{@render menu()}
	</div>
{/if}
