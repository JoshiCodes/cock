<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';
	import { portal } from '../../actions/portal.js';
	import { toasts, type ToastVariant } from '../../state/toast.svelte.js';

	interface Props {
		position?:
			'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
		class?: string;
	}

	let { position = 'bottom-right', class: className }: Props = $props();

	const positions = {
		'top-left': 'top-0 left-0 items-start',
		'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
		'top-right': 'top-0 right-0 items-end',
		'bottom-left': 'bottom-0 left-0 items-start flex-col-reverse',
		'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
		'bottom-right': 'bottom-0 right-0 items-end flex-col-reverse'
	};

	const accents: Record<ToastVariant, string> = {
		default: 'bg-fg-subtle',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};

	let fromTop = $derived(position.startsWith('top'));
	let fromRight = $derived(position.endsWith('right'));
</script>

<div
	use:portal
	class={cn(
		'pointer-events-none fixed z-60 flex w-full max-w-sm flex-col gap-2 p-4',
		positions[position],
		className
	)}
>
	{#each toasts.items as item (item.id)}
		<div
			animate:flip={{ duration: 200 }}
			in:fly={{ y: fromTop ? -16 : 16, x: fromRight ? 16 : 0, duration: 220 }}
			out:fly={{ x: fromRight ? 24 : -24, duration: 160 }}
			role="status"
			aria-live="polite"
			class="pointer-events-auto relative flex w-full gap-3 overflow-hidden rounded-lg border border-border bg-surface p-3.5 pl-4 shadow-lg"
		>
			<span class={cn('absolute inset-y-0 left-0 w-1', accents[item.variant])}></span>

			<div class="min-w-0 flex-1 space-y-0.5">
				<p class="text-sm leading-tight font-medium text-fg">{item.title}</p>
				{#if item.description}
					<p class="text-xs leading-relaxed text-fg-muted">{item.description}</p>
				{/if}
				{#if item.action}
					<button
						type="button"
						onclick={() => {
							item.action?.onclick();
							toasts.dismiss(item.id);
						}}
						class={cn(
							'mt-1.5 cursor-pointer text-xs font-semibold text-accent hover:underline',
							focusRing
						)}
					>
						{item.action.label}
					</button>
				{/if}
			</div>

			<button
				type="button"
				onclick={() => toasts.dismiss(item.id)}
				aria-label="Dismiss notification"
				class={cn(
					'-mt-0.5 -mr-0.5 size-5 shrink-0 cursor-pointer rounded p-0.5 text-fg-subtle transition-colors hover:text-fg',
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
		</div>
	{/each}
</div>
