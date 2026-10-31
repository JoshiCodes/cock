<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { theme } from '../../state/theme.svelte.js';

	interface Props {
		/** `icon` swaps a single glyph, `segmented` shows light / dark / system. */
		variant?: 'icon' | 'segmented';
		class?: string;
	}

	let { variant = 'icon', class: className }: Props = $props();

	const modes = [
		{
			value: 'light',
			label: 'Light',
			path: 'M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M6.2 6.2 4.8 4.8m14.4 14.4-1.4-1.4M6.2 17.8l-1.4 1.4M19.2 4.8l-1.4 1.4',
			circle: true
		},
		{
			value: 'dark',
			label: 'Dark',
			path: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
			circle: false
		},
		{ value: 'system', label: 'System', path: 'M4 5.5h16v10H4zM9 19.5h6', circle: false }
	] as const;
</script>

{#if variant === 'segmented'}
	<div
		class={cn('inline-flex items-center gap-0.5 rounded-md bg-muted p-0.5', className)}
		role="group"
		aria-label="Colour scheme"
	>
		{#each modes as mode (mode.value)}
			<button
				type="button"
				aria-label={mode.label}
				aria-pressed={theme.mode === mode.value}
				onclick={() => (theme.mode = mode.value)}
				class={cn(
					'inline-flex size-7 cursor-pointer items-center justify-center rounded-md',
					transition,
					focusRing,
					theme.mode === mode.value
						? 'bg-surface text-fg shadow-xs'
						: 'text-fg-subtle hover:text-fg'
				)}
			>
				<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
					{#if mode.circle}
						<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75" />
					{/if}
					<path
						d={mode.path}
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/each}
	</div>
{:else}
	<button
		type="button"
		onclick={() => theme.toggle()}
		aria-label="Toggle colour scheme"
		class={cn(
			'inline-flex size-9 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-fg-muted shadow-xs hover:bg-muted hover:text-fg',
			transition,
			focusRing,
			className
		)}
	>
		<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
			{#if theme.resolved === 'dark'}
				<path
					d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{:else}
				<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75" />
				<path
					d="M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M6.2 6.2 4.8 4.8m14.4 14.4-1.4-1.4M6.2 17.8l-1.4 1.4M19.2 4.8l-1.4 1.4"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
			{/if}
		</svg>
	</button>
{/if}
