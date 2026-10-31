<script lang="ts" module>
	export type BadgeVariant =
		'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'> {
		variant?: BadgeVariant;
		size?: 'sm' | 'md';
		/** Show a small leading status dot. */
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'neutral',
		size = 'md',
		dot = false,
		class: className,
		children,
		...rest
	}: Props = $props();

	const variants: Record<BadgeVariant, string> = {
		neutral: 'border-border bg-surface text-fg-muted',
		accent: 'border-accent/30 bg-accent/10 text-accent',
		success: 'border-success/30 bg-success/10 text-success',
		warning: 'border-warning/35 bg-warning/12 text-warning',
		danger: 'border-danger/30 bg-danger/10 text-danger',
		info: 'border-info/30 bg-info/10 text-info',
		outline: 'border-border bg-transparent text-fg-muted'
	};

	const sizes = {
		sm: 'h-5 gap-1 px-1.5 text-[0.6875rem]',
		md: 'h-6 gap-1.5 px-2 text-xs'
	};
</script>

<span
	class={cn(
		'inline-flex items-center rounded-sm border font-medium whitespace-nowrap',
		variants[variant],
		sizes[size],
		className
	)}
	{...rest}
>
	{#if dot}
		<span class="size-1.5 shrink-0 rounded-[1px] bg-current"></span>
	{/if}
	{@render children?.()}
</span>
