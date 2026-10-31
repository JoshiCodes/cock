<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { MENU } from '../../utils/context.js';
	import type { MenuContext } from './DropdownMenu.svelte';

	interface Props {
		onselect?: () => void;
		/** Render as a link instead of a button. */
		href?: string;
		disabled?: boolean;
		variant?: 'default' | 'danger';
		/** Leading icon slot. */
		icon?: Snippet;
		/** Trailing hint, e.g. a keyboard shortcut. */
		hint?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		onselect,
		href,
		disabled = false,
		variant = 'default',
		icon,
		hint,
		class: className,
		children
	}: Props = $props();

	const menu = getContext<MenuContext | undefined>(MENU);

	const variants = {
		default: 'text-fg hover:bg-muted focus-visible:bg-muted',
		danger: 'text-danger hover:bg-danger/10 focus-visible:bg-danger/10'
	};

	function select() {
		if (disabled) return;
		onselect?.();
		menu?.close();
	}

	let classes = $derived(
		cn(
			'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm outline-none transition-colors',
			'disabled:pointer-events-none disabled:opacity-50',
			variants[variant],
			className
		)
	);
</script>

{#if href}
	<a role="menuitem" {href} class={classes} onclick={() => menu?.close()}>
		{#if icon}<span class="shrink-0 text-fg-subtle">{@render icon()}</span>{/if}
		<span class="flex-1 truncate">{@render children?.()}</span>
		{#if hint}<span class="text-xs text-fg-subtle tabular-nums">{hint}</span>{/if}
	</a>
{:else}
	<button type="button" role="menuitem" {disabled} class={classes} onclick={select}>
		{#if icon}<span class="shrink-0 text-fg-subtle">{@render icon()}</span>{/if}
		<span class="flex-1 truncate">{@render children?.()}</span>
		{#if hint}<span class="text-xs text-fg-subtle tabular-nums">{hint}</span>{/if}
	</button>
{/if}
