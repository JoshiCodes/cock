<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { TABS, requireContext } from '../../utils/context.js';
	import type { TabsContext } from './Tabs.svelte';

	interface Props {
		value: string;
		class?: string;
		children?: Snippet;
	}

	let { value, class: className, children }: Props = $props();

	const tabs = requireContext<TabsContext>(TABS, 'TabPanel', 'Tabs');
</script>

{#if tabs.value === value}
	<div
		role="tabpanel"
		id="{tabs.id}-panel-{value}"
		aria-labelledby="{tabs.id}-tab-{value}"
		tabindex="0"
		class={cn('outline-none', className)}
	>
		{@render children?.()}
	</div>
{/if}
