<script lang="ts">
	import { scale } from 'svelte/transition';
	import Button, { type ButtonSize, type ButtonVariant } from './Button.svelte';

	interface Props {
		/** The text that ends up on the clipboard. */
		value: string;
		label?: string;
		copiedLabel?: string;
		/** Icon only; the label becomes the accessible name. */
		iconOnly?: boolean;
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		oncopy?: (value: string) => void;
	}

	let {
		value,
		label = 'Copy',
		copiedLabel = 'Copied',
		iconOnly = false,
		variant = 'outline',
		size,
		class: className,
		oncopy
	}: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			return;
		}
		copied = true;
		oncopy?.(value);
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1600);
	}
</script>

<Button
	{variant}
	size={size ?? (iconOnly ? 'icon-sm' : 'sm')}
	onclick={copy}
	aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
	class={className}
>
	<span class="relative inline-flex size-4">
		{#key copied}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				class="absolute inset-0 size-4"
				aria-hidden="true"
				in:scale={{ duration: 160, start: 0.6 }}
			>
				{#if copied}
					<path
						d="m5 12.5 4.5 4.5L19 7.5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				{:else}
					<rect
						x="8"
						y="8"
						width="12"
						height="12"
						rx="2.5"
						stroke="currentColor"
						stroke-width="1.75"
					/>
					<path
						d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"
						stroke="currentColor"
						stroke-width="1.75"
					/>
				{/if}
			</svg>
		{/key}
	</span>
	{#if !iconOnly}
		<span aria-live="polite">{copied ? copiedLabel : label}</span>
	{/if}
</Button>
