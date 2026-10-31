<script lang="ts" module>
	export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link' | 'danger';
	export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRing, disabled as disabledStyle, transition } from '../../utils/styles.js';
	import Spinner from './Spinner.svelte';

	type Props = Omit<HTMLButtonAttributes, 'class'> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		/** Render as an `<a>` instead of a `<button>`. */
		href?: string;
		target?: string;
		rel?: string;
		loading?: boolean;
		/** Stretch to the full width of the parent. */
		block?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		variant = 'solid',
		size = 'md',
		href,
		loading = false,
		block = false,
		disabled,
		type = 'button',
		class: className,
		children,
		...rest
	}: Props = $props();

	const variants: Record<ButtonVariant, string> = {
		solid:
			'border-black/10 bg-accent text-accent-fg hover:bg-accent-hover dark:border-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.14),0_1px_2px_rgb(0_0_0/0.1)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgb(0_0_0/0.2)]',
		soft: 'border-transparent bg-accent/12 text-accent hover:bg-accent/20 active:translate-y-px',
		outline:
			'border-border bg-surface text-fg shadow-[inset_0_-1px_0_var(--ck-border)] hover:border-border-strong hover:bg-muted active:translate-y-px active:shadow-none',
		ghost: 'border-transparent bg-transparent text-fg-muted hover:bg-muted hover:text-fg',
		link: 'h-auto border-transparent bg-transparent p-0 text-accent underline-offset-4 hover:underline',
		danger:
			'border-black/10 bg-danger text-white hover:brightness-110 dark:text-bg shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.14),0_1px_2px_rgb(0_0_0/0.1)] active:translate-y-px active:shadow-[inset_0_1px_2px_rgb(0_0_0/0.2)]'
	};

	const sizes: Record<ButtonSize, string> = {
		sm: 'h-8 gap-1.5 px-3 text-[0.8125rem]',
		md: 'h-9 gap-2 px-3.5 text-sm',
		lg: 'h-11 gap-2 px-5 text-[0.9375rem]',
		icon: 'size-9 p-0',
		'icon-sm': 'size-8 p-0'
	};

	let isDisabled = $derived(disabled || loading);

	// The props are typed against <button>; the <a> branch takes the same bag,
	// and TypeScript will not reconcile the two sets of event handler types.
	let anchorRest = $derived(rest as Record<string, unknown>);
	let classes = $derived(
		cn(
			'relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border font-medium whitespace-nowrap select-none',
			transition,
			focusRing,
			disabledStyle,
			variants[variant],
			variant !== 'link' && sizes[size],
			block && 'w-full',
			className
		)
	);
</script>

{#if href}
	<a
		{href}
		class={classes}
		aria-disabled={isDisabled || undefined}
		tabindex={isDisabled ? -1 : undefined}
		{...anchorRest}
	>
		{#if loading}<Spinner size={size === 'lg' ? 'md' : 'sm'} />{/if}
		{@render children?.()}
	</a>
{:else}
	<button {type} class={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
		{#if loading}<Spinner size={size === 'lg' ? 'md' : 'sm'} />{/if}
		{@render children?.()}
	</button>
{/if}
