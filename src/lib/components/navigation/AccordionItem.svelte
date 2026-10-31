<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import { ACCORDION, requireContext } from '../../utils/context.js';
	import type { AccordionContext } from './Accordion.svelte';

	interface Props {
		value: string;
		title: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { value, title, disabled = false, class: className, children }: Props = $props();

	const accordion = requireContext<AccordionContext>(ACCORDION, 'AccordionItem', 'Accordion');
	const id = uid('acc');

	let open = $derived(accordion.isOpen(value));
</script>

<div class={className}>
	<h3>
		<button
			type="button"
			id="{id}-trigger"
			aria-expanded={open}
			aria-controls="{id}-panel"
			{disabled}
			onclick={() => accordion.toggle(value)}
			class={cn(
				'flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/60',
				'first:rounded-t-lg last:rounded-b-lg disabled:pointer-events-none disabled:opacity-50',
				focusRing
			)}
		>
			<span class="text-sm font-medium text-fg">{title}</span>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
				class={cn(
					'size-4 shrink-0 text-fg-subtle transition-transform duration-200',
					open && 'rotate-180'
				)}
			>
				<path
					d="m7 10 5 5 5-5"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</h3>

	{#if open}
		<div
			id="{id}-panel"
			role="region"
			aria-labelledby="{id}-trigger"
			transition:slide={{ duration: 200 }}
		>
			<div class="px-4 pt-0 pb-4 text-sm leading-relaxed text-fg-muted">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
