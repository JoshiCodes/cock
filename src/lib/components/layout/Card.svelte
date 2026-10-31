<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
		/** `elevated` adds a shadow, `raised` lifts on hover, `flat` drops the border too. */
		variant?: 'default' | 'flat' | 'elevated' | 'raised';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		padding = 'none',
		class: className,
		children,
		...rest
	}: Props = $props();

	// Dark backgrounds swallow shadows, so there elevation shows as a lighter
	// surface and a stronger edge instead.
	const lift = 'dark:border-border-strong dark:bg-[color-mix(in_oklab,var(--ck-surface),white_4%)]';

	const variants = {
		default: '',
		flat: 'border-transparent bg-muted',
		elevated: `shadow-md ${lift}`,
		raised: `hover:-translate-y-0.5 hover:shadow-lg hover:border-border-strong dark:hover:bg-[color-mix(in_oklab,var(--ck-surface),white_4%)]`
	};

	const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-7' };
</script>

<div
	class={cn(
		'rounded-lg border border-border bg-surface',
		transition,
		variants[variant],
		paddings[padding],
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
