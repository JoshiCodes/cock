<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** `undefined` renders an indeterminate bar. */
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'accent' | 'success' | 'warning' | 'danger';
		label?: string;
		class?: string;
	}

	let {
		value,
		max = 100,
		size = 'md',
		variant = 'accent',
		label,
		class: className
	}: Props = $props();

	const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
	const variants = {
		accent: 'bg-accent',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger'
	};

	let percent = $derived(
		value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100))
	);
</script>

<div
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
	aria-label={label}
	class={cn('w-full overflow-hidden rounded-full bg-muted', sizes[size], className)}
>
	{#if percent === undefined}
		<div class={cn('ck-indeterminate h-full w-2/5 rounded-full', variants[variant])}></div>
	{:else}
		<div
			class={cn('h-full rounded-full transition-[width] duration-500 ease-out', variants[variant])}
			style:width="{percent}%"
		></div>
	{/if}
</div>

<style>
	.ck-indeterminate {
		animation: ck-slide 1.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
	}
	@keyframes ck-slide {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(350%);
		}
	}
</style>
