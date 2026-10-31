<script lang="ts" module>
	export type AlertVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';

	interface Props {
		variant?: AlertVariant;
		title?: string;
		/** Renders a dismiss button and calls back when pressed. */
		ondismiss?: () => void;
		/** Replace the built-in status glyph. */
		icon?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let { variant = 'neutral', title, ondismiss, icon, class: className, children }: Props = $props();

	const variants: Record<AlertVariant, string> = {
		neutral: 'border-border bg-muted/50 text-fg',
		accent: 'border-accent/25 bg-accent/8 text-fg',
		success: 'border-success/25 bg-success/8 text-fg',
		warning: 'border-warning/30 bg-warning/10 text-fg',
		danger: 'border-danger/25 bg-danger/8 text-fg',
		info: 'border-info/25 bg-info/8 text-fg'
	};

	const iconColors: Record<AlertVariant, string> = {
		neutral: 'text-fg-muted',
		accent: 'text-accent',
		success: 'text-success',
		warning: 'text-warning',
		danger: 'text-danger',
		info: 'text-info'
	};

	const paths: Record<AlertVariant, string> = {
		neutral: 'M12 8h.01M11 12h1v4h1',
		accent: 'M12 8h.01M11 12h1v4h1',
		success: 'm8 12.5 2.5 2.5L16 9.5',
		warning: 'M12 8.5v4m0 3h.01',
		danger: 'm9.5 9.5 5 5m0-5-5 5',
		info: 'M12 8h.01M11 12h1v4h1'
	};
</script>

<div role="alert" class={cn('flex gap-3 rounded-lg border p-4', variants[variant], className)}>
	<span class={cn('mt-px shrink-0', iconColors[variant])}>
		{#if icon}
			{@render icon()}
		{:else}
			<svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
				<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
				<path
					d={paths[variant]}
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>

	<div class="min-w-0 flex-1 space-y-1">
		{#if title}
			<p class="text-sm leading-tight font-semibold">{title}</p>
		{/if}
		{#if children}
			<div class="text-sm leading-relaxed text-fg-muted">{@render children()}</div>
		{/if}
	</div>

	{#if ondismiss}
		<button
			type="button"
			onclick={ondismiss}
			aria-label="Dismiss"
			class={cn(
				'-m-1 size-6 shrink-0 cursor-pointer rounded-md p-1 text-fg-subtle transition-colors hover:text-fg',
				focusRing
			)}
		>
			<svg viewBox="0 0 24 24" fill="none" class="size-full" aria-hidden="true">
				<path
					d="m6 6 12 12M18 6 6 18"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	{/if}
</div>
