<script lang="ts" module>
	export type NavbarOrientation = 'horizontal' | 'vertical';
	export type NavbarCollapse = 'sm' | 'md' | 'lg' | 'never';

	export interface NavbarContext {
		readonly orientation: NavbarOrientation;
		readonly current: string | undefined;
		/** Classes for a nested list, so a group lays out like the top level. */
		readonly row: string;
		close: () => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import { NAVBAR } from '../../utils/context.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
		/** `horizontal` is a top bar, `vertical` a sidebar. */
		orientation?: NavbarOrientation;
		/** The current path, usually `page.url.pathname`, or `location.hash` with a hash router. Links compare their `href` against it. */
		current?: string;
		/** Below this breakpoint a horizontal bar folds its links behind a menu button. */
		collapse?: NavbarCollapse;
		/** Whether the folded menu is showing. */
		open?: boolean;
		/** Names the landmark for screen readers. Give each navbar on a page its own. */
		label?: string;
		/** Logo or product name, at the start. */
		brand?: Snippet;
		/** Trailing controls: right of a top bar, pinned to the bottom of a sidebar. */
		actions?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		current,
		collapse = 'md',
		open = $bindable(false),
		label = 'Main',
		brand,
		actions,
		class: className,
		children,
		...rest
	}: Props = $props();

	const id = uid('navbar');
	let toggle = $state<HTMLButtonElement>();

	// Spelled out per breakpoint because Tailwind only sees whole class names.
	const breakpoints = {
		sm: {
			list: 'sm:order-none sm:flex sm:basis-auto sm:flex-row sm:items-center sm:gap-6 sm:pb-0',
			row: 'flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6',
			toggle: 'sm:hidden'
		},
		md: {
			list: 'md:order-none md:flex md:basis-auto md:flex-row md:items-center md:gap-6 md:pb-0',
			row: 'flex flex-col gap-1 md:flex-row md:items-center md:gap-6',
			toggle: 'md:hidden'
		},
		lg: {
			list: 'lg:order-none lg:flex lg:basis-auto lg:flex-row lg:items-center lg:gap-6 lg:pb-0',
			row: 'flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6',
			toggle: 'lg:hidden'
		}
	};

	let horizontal = $derived(orientation === 'horizontal');
	let folds = $derived(horizontal && collapse !== 'never');
	let bp = $derived(collapse === 'never' ? undefined : breakpoints[collapse]);

	let row = $derived(
		!horizontal ? 'flex flex-col gap-0.5' : bp ? bp.row : 'flex flex-row items-center gap-6'
	);

	let listClass = $derived(
		!horizontal
			? 'flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto'
			: bp
				? cn('flex-col gap-1', open ? 'order-last flex basis-full pb-1' : 'hidden', bp.list)
				: 'flex flex-row items-center gap-6'
	);

	setContext<NavbarContext>(NAVBAR, {
		get orientation() {
			return orientation;
		},
		get current() {
			return current;
		},
		get row() {
			return row;
		},
		close: () => (open = false)
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		open = false;
		toggle?.focus();
	}
</script>

<svelte:window onkeydown={folds && open ? onkeydown : undefined} />

<nav
	aria-label={label}
	{...rest}
	class={cn(
		// The top bar is usually sticky, so it needs a fill of its own. A sidebar
		// takes whatever it sits on, which is what lets it live inside a Drawer.
		horizontal
			? 'flex min-h-16 flex-wrap items-center gap-x-8 gap-y-2 border-b border-border bg-bg px-5 py-3'
			: 'flex h-full w-60 flex-col gap-5 border-r border-border p-3',
		className
	)}
>
	{#if brand}
		<div class={cn('flex shrink-0 items-center', !horizontal && 'px-3 pt-1.5')}>
			{@render brand()}
		</div>
	{/if}

	<ul id="{id}-list" class={listClass}>
		{@render children?.()}
	</ul>

	{#if actions || folds}
		<div
			class={cn('flex items-center gap-2', horizontal ? 'ml-auto' : 'border-t border-border pt-3')}
		>
			{@render actions?.()}

			{#if folds}
				<button
					bind:this={toggle}
					type="button"
					aria-expanded={open}
					aria-controls="{id}-list"
					aria-label={open ? 'Close menu' : 'Open menu'}
					onclick={() => (open = !open)}
					class={cn(
						'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-muted hover:bg-muted hover:text-fg',
						transition,
						focusRing,
						bp?.toggle
					)}
				>
					<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
						{#if open}
							<path
								d="m6 6 12 12M18 6 6 18"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
							/>
						{:else}
							<path
								d="M4 7h16M4 12h16M4 17h16"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
							/>
						{/if}
					</svg>
				</button>
			{/if}
		</div>
	{/if}
</nav>
