<script lang="ts" module>
	export type StatusTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'> {
		tone?: StatusTone;
		size?: 'sm' | 'md' | 'lg';
		/** What the dot means, for screen readers. Not needed when there is visible text. */
		label?: string;
		class?: string;
		/** Text next to the dot. */
		children?: Snippet;
	}

	let {
		tone = 'neutral',
		size = 'md',
		label,
		class: className,
		children,
		...rest
	}: Props = $props();

	const tones: Record<StatusTone, string> = {
		neutral: 'bg-fg-subtle',
		accent: 'bg-accent',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};

	const sizes = {
		sm: 'size-1.5',
		md: 'size-2',
		lg: 'size-2.5'
	};
</script>

<span
	class={cn('inline-flex items-center gap-2 text-sm text-fg', className)}
	role={children ? undefined : 'img'}
	aria-label={children ? undefined : label}
	{...rest}
>
	<span class={cn('shrink-0 rounded-full', tones[tone], sizes[size])} aria-hidden="true"></span>
	{@render children?.()}
</span>
