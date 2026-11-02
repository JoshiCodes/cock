<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import { NAVBAR, requireContext } from '../../utils/context.js';
	import type { NavbarContext } from './Navbar.svelte';

	interface Props {
		/** Section heading in a sidebar. In a top bar it is read out but not shown. */
		label: string;
		/** Lets the section fold away behind its heading. Sidebars only. */
		collapsible?: boolean;
		/** Whether a collapsible section is expanded. */
		open?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		label,
		collapsible = false,
		open = $bindable(true),
		class: className,
		children
	}: Props = $props();

	const navbar = requireContext<NavbarContext>(NAVBAR, 'NavbarGroup', 'Navbar');
	const id = uid('navgroup');

	let vertical = $derived(navbar.orientation === 'vertical');
	let expanded = $derived(!vertical || !collapsible || open);

	const heading = 'px-3 text-xs font-medium tracking-wide text-fg-subtle uppercase';
</script>

<li class={cn(vertical && 'pt-4 first:pt-0', className)}>
	{#if vertical && collapsible}
		<button
			type="button"
			id="{id}-label"
			aria-expanded={open}
			aria-controls="{id}-list"
			onclick={() => (open = !open)}
			class={cn(
				heading,
				'mb-1 flex w-full cursor-pointer items-center justify-between rounded-md py-1 hover:text-fg',
				transition,
				focusRing
			)}
		>
			{label}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				class={cn('size-3.5 transition-transform duration-200', !open && '-rotate-90')}
			>
				<path
					d="m7 10 5 5 5-5"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	{:else}
		<span id="{id}-label" class={vertical ? cn(heading, 'mb-1 block py-1') : 'sr-only'}>
			{label}
		</span>
	{/if}

	{#if expanded}
		<ul
			id="{id}-list"
			aria-labelledby="{id}-label"
			class={navbar.row}
			transition:slide={{ duration: collapsible ? 180 : 0 }}
		>
			{@render children?.()}
		</ul>
	{/if}
</li>
