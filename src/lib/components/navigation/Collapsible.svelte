<script lang="ts" module>
	export interface CollapsibleTriggerAttrs {
		onclick: () => void;
		'aria-expanded': boolean;
		'aria-controls': string;
		disabled: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';

	interface Props {
		open?: boolean;
		/** Text for the built-in trigger. Leave it out and pass `trigger` instead. */
		title?: string;
		disabled?: boolean;
		class?: string;
		/** Your own trigger; spread the attrs onto a button. */
		trigger?: Snippet<[CollapsibleTriggerAttrs]>;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		disabled = false,
		class: className,
		trigger,
		children
	}: Props = $props();

	const id = uid('collapsible');

	let attrs = $derived<CollapsibleTriggerAttrs>({
		onclick: () => (open = !open),
		'aria-expanded': open,
		'aria-controls': id,
		disabled
	});
</script>

<div class={className}>
	{#if trigger}
		{@render trigger(attrs)}
	{:else}
		<button
			type="button"
			{...attrs}
			class={cn(
				'group inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium text-fg-muted hover:text-fg disabled:pointer-events-none disabled:opacity-50',
				transition,
				focusRing
			)}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				class={cn('size-4 shrink-0 transition-transform duration-200', open && 'rotate-90')}
			>
				<path
					d="m10 7 5 5-5 5"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			{title}
		</button>
	{/if}

	{#if open}
		<div {id} transition:slide={{ duration: 200 }}>
			{@render children?.()}
		</div>
	{/if}
</div>
