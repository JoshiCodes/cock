<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';
	import { lockScroll } from '../../utils/scrollLock.js';
	import { portal } from '../../actions/portal.js';
	import { trapFocus } from '../../actions/trapFocus.js';
	import { uid } from '../../utils/id.js';

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		/** Clicking the backdrop closes the modal. */
		dismissible?: boolean;
		/** Hide the built-in close button in the header. */
		hideClose?: boolean;
		class?: string;
		children?: Snippet;
		/** Pinned to the bottom of the panel, separated by a hairline. */
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		size = 'md',
		dismissible = true,
		hideClose = false,
		class: className,
		children,
		footer,
		onclose
	}: Props = $props();

	const id = uid('modal');

	const sizes = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
	};

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
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" use:portal>
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
			aria-describedby={description ? `${id}-desc` : undefined}
			tabindex="-1"
			use:trapFocus
			transition:scale={{ duration: 180, start: 0.97, opacity: 0 }}
			class={cn(
				'relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
				'max-h-[calc(100vh-3rem)]',
				sizes[size],
				className
			)}
		>
			{#if title || description || !hideClose}
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
							<p id="{id}-desc" class="text-sm leading-relaxed text-fg-muted">{description}</p>
						{/if}
					</div>

					{#if !hideClose}
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
					{/if}
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
