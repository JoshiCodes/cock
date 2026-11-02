<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { NAVBAR, requireContext } from '../../utils/context.js';
	import type { NavbarContext } from './Navbar.svelte';

	interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href'> {
		href: string;
		/** Overrides the comparison with the navbar's `current`. */
		active?: boolean;
		/** `prefix` also marks the link on pages below it, so `/docs` stays lit on `/docs/install`. */
		match?: 'exact' | 'prefix';
		/** Sixteen-pixel icon before the label. */
		icon?: Snippet;
		/** Pushed to the far end: a count, a badge, a shortcut. */
		trailing?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let {
		href,
		active,
		match = 'exact',
		icon,
		trailing,
		onclick,
		class: className,
		children,
		...rest
	}: Props = $props();

	const navbar = requireContext<NavbarContext>(NAVBAR, 'NavbarLink', 'Navbar');

	function matches(current: string | undefined): boolean {
		if (current === undefined) return false;
		// A hash router keeps the route in the fragment, so the whole thing counts.
		if (href.startsWith('#')) return current === href;
		const path = href.split(/[?#]/)[0];
		if (current === path) return true;
		if (match !== 'prefix') return false;
		return current.startsWith(path.endsWith('/') ? path : `${path}/`);
	}

	let isActive = $derived(active ?? matches(navbar.current));

	// A top bar reads as plain text; a sidebar gets a filled row so the current
	// page is easy to find in a long list.
	const styles = {
		horizontal: {
			base: 'py-1.5',
			on: 'font-medium text-fg',
			off: 'text-fg-muted hover:text-fg'
		},
		vertical: {
			base: 'px-3 py-1.5',
			on: 'bg-muted font-medium text-fg',
			off: 'text-fg-muted hover:bg-muted/60 hover:text-fg'
		}
	};
</script>

<li class="min-w-0">
	<a
		{href}
		{...rest}
		aria-current={isActive ? 'page' : undefined}
		onclick={(event) => {
			navbar.close();
			onclick?.(event);
		}}
		class={cn(
			'flex items-center gap-2.5 rounded-md text-sm',
			transition,
			focusRing,
			styles[navbar.orientation].base,
			isActive ? styles[navbar.orientation].on : styles[navbar.orientation].off,
			className
		)}
	>
		{#if icon}
			<span
				aria-hidden="true"
				class={cn(
					'flex size-4 shrink-0 items-center justify-center [&>svg]:size-4',
					isActive ? 'text-fg' : 'text-fg-subtle'
				)}
			>
				{@render icon()}
			</span>
		{/if}

		<span class="min-w-0 truncate">{@render children?.()}</span>

		{#if trailing}
			<span class="ml-auto flex shrink-0 items-center pl-2">{@render trailing()}</span>
		{/if}
	</a>
</li>
