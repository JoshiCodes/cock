<script lang="ts" module>
	export type LinkVariant = 'accent' | 'muted' | 'inherit';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';

	interface Props extends Omit<HTMLAnchorAttributes, 'class' | 'href'> {
		href: string;
		variant?: LinkVariant;
		/** `hover` keeps the text clean until the pointer is on it. Fine in a nav, harder to spot in a paragraph. */
		underline?: 'always' | 'hover';
		/** Opens in a new tab and adds an arrow. Defaults to true for `http(s)://` and `//` URLs. */
		external?: boolean;
		/** Read out after the text of an external link. */
		newTabLabel?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		href,
		variant = 'accent',
		underline = 'always',
		external,
		newTabLabel = 'opens in a new tab',
		target,
		rel,
		class: className,
		children,
		...rest
	}: Props = $props();

	const variants: Record<LinkVariant, string> = {
		accent: 'text-accent hover:text-accent-hover',
		muted: 'text-fg-muted hover:text-fg',
		inherit: 'text-inherit'
	};

	const underlines = {
		always: 'underline decoration-current/35 hover:decoration-current',
		hover: 'no-underline hover:underline hover:decoration-current'
	};

	let isExternal = $derived(external ?? /^(https?:)?\/\//i.test(href));
	let linkTarget = $derived(target ?? (isExternal ? '_blank' : undefined));
	// A new tab gets access to window.opener unless told otherwise.
	let linkRel = $derived(rel ?? (linkTarget === '_blank' ? 'noopener noreferrer' : undefined));
</script>

<a
	{href}
	target={linkTarget}
	rel={linkRel}
	class={cn(
		'rounded-[2px] underline-offset-[0.22em] transition-[color,text-decoration-color] duration-150 ease-out',
		focusRing,
		variants[variant],
		underlines[underline],
		className
	)}
	{...rest}
>
	{@render children?.()}{#if isExternal}
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			class="ml-0.5 inline-block size-[0.8em] align-[-0.05em]"
		>
			<path
				d="M7 17 17 7M9 7h8v8"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		{#if linkTarget === '_blank'}<span class="sr-only"> ({newTabLabel})</span>{/if}
	{/if}
</a>
