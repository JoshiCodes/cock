<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { TABS, requireContext } from '../../utils/context.js';
	import type { TabsContext } from './Tabs.svelte';

	interface Props {
		value: string;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let { value, disabled = false, class: className, children }: Props = $props();

	const tabs = requireContext<TabsContext>(TABS, 'Tab', 'Tabs');

	let selected = $derived(tabs.value === value);

	const variants = {
		line: {
			base: '-mb-px border-b-2 px-3.5 py-2',
			on: 'border-accent text-fg',
			off: 'border-transparent text-fg-muted hover:text-fg hover:border-border-strong'
		},
		pill: {
			base: 'rounded-md px-3.5 py-1.5',
			on: 'bg-surface text-fg shadow-xs',
			off: 'text-fg-muted hover:text-fg'
		}
	};
</script>

<button
	type="button"
	role="tab"
	id="{tabs.id}-tab-{value}"
	aria-selected={selected}
	aria-controls="{tabs.id}-panel-{value}"
	tabindex={selected ? 0 : -1}
	{disabled}
	onclick={() => tabs.select(value)}
	class={cn(
		'cursor-pointer text-sm font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
		transition,
		focusRing,
		variants[tabs.variant].base,
		selected ? variants[tabs.variant].on : variants[tabs.variant].off,
		className
	)}
>
	{@render children?.()}
</button>
