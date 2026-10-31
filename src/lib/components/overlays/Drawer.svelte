<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';
	import { lockScroll } from '../../utils/scrollLock.js';
	import { portal } from '../../actions/portal.js';
	import { trapFocus } from '../../actions/trapFocus.js';
	import { uid } from '../../utils/id.js';

	interface Props {
		open?: boolean;
		side?: 'left' | 'right' | 'top' | 'bottom';
		title?: string;
		description?: string;
		/** Width for left/right, height for top/bottom. */
		size?: string;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		side = 'right',
		title,
		description,
		size,
		dismissible = true,
		class: className,
		children,
		footer,
		onclose
	}: Props = $props();

	const id = uid('drawer');

	const positions = {
		left: 'inset-y-0 left-0 h-full border-r rounded-r-xl',
		right: 'inset-y-0 right-0 h-full border-l rounded-l-xl',
		top: 'inset-x-0 top-0 w-full border-b rounded-b-xl',
		bottom: 'inset-x-0 bottom-0 w-full border-t rounded-t-xl'
	};

	const defaultSizes = {
		left: 'w-full max-w-sm',
		right: 'w-full max-w-sm',
		top: 'max-h-[85vh]',
		bottom: 'max-h-[85vh]'
	};

	let flyParams = $derived(
		{
			left: { x: -320, duration: 240 },
			right: { x: 320, duration: 240 },
			top: { y: -320, duration: 240 },
			bottom: { y: 320, duration: 240 }
		}[side]
	);

	function close() {
		open = false;
		onclose?.();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && dismissible) {
			event.preventDefault();
			close();
		}
	}

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});
</script>

<svelte:window onkeydown={open ? onkeydown : undefined} />

{#if open}
	<div class="fixed inset-0 z-50" use:portal>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-fg/20 backdrop-blur-[2px] dark:bg-black/60"
			transition:fade={{ duration: 150 }}
			onclick={() => dismissible && close()}
		></div>

		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? `${id}-title` : undefined}
			tabindex="-1"
			use:trapFocus
			transition:fly={flyParams}
			class={cn(
				'absolute flex flex-col border-border bg-surface shadow-lg',
				positions[side],
				size ?? defaultSizes[side],
				className
			)}
		>
			{#if title || description}
				<div class="flex items-start justify-between gap-4 p-5 pb-3">
					<div class="min-w-0 space-y-1">
						{#if title}
							<h2
								id="{id}-title"
								class="text-base leading-tight font-semibold tracking-tight text-fg"
							>
								{title}
							</h2>
						{/if}
						{#if description}
							<p class="text-sm leading-relaxed text-fg-muted">{description}</p>
						{/if}
					</div>
					<button
						type="button"
						onclick={close}
						aria-label="Close"
						class={cn(
							'-m-1 shrink-0 cursor-pointer rounded-md p-1.5 text-fg-subtle transition-colors hover:bg-muted hover:text-fg',
							focusRing
						)}
					>
						<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
							<path
								d="m6 6 12 12M18 6 6 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<div class="min-h-0 flex-1 overflow-y-auto px-5 pb-5 text-sm leading-relaxed">
				{@render children?.()}
			</div>

			{#if footer}
				<div class="flex items-center justify-end gap-2 border-t border-border bg-muted/40 p-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
