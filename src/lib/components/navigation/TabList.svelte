<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { TABS, requireContext } from '../../utils/context.js';
	import type { TabsContext } from './Tabs.svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	const tabs = requireContext<TabsContext>(TABS, 'TabList', 'Tabs');

	let list = $state<HTMLElement | null>(null);

	function onkeydown(event: KeyboardEvent) {
		const items = Array.from(list?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
		const index = items.indexOf(document.activeElement as HTMLElement);
		if (index === -1) return;

		const next = {
			ArrowRight: (index + 1) % items.length,
			ArrowLeft: (index - 1 + items.length) % items.length,
			Home: 0,
			End: items.length - 1
		}[event.key];

		if (next === undefined) return;
		event.preventDefault();
		items[next]?.focus();
		items[next]?.click();
	}
</script>

<div
	bind:this={list}
	role="tablist"
	tabindex={-1}
	{onkeydown}
	class={cn(
		// Tabs never wrap; on a narrow screen the strip scrolls instead.
		'flex [scrollbar-width:none] items-center overflow-x-auto [&::-webkit-scrollbar]:hidden',
		tabs.variant === 'line'
			? 'gap-1 border-b border-border'
			: 'w-fit max-w-full gap-1 rounded-lg bg-muted p-1',
		className
	)}
>
	{@render children?.()}
</div>
