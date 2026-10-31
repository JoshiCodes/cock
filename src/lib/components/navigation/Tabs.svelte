<script lang="ts" module>
	export type TabsVariant = 'line' | 'pill';

	export interface TabsContext {
		readonly value: string;
		readonly variant: TabsVariant;
		readonly id: string;
		select: (value: string) => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import { TABS } from '../../utils/context.js';

	interface Props {
		value?: string;
		variant?: TabsVariant;
		class?: string;
		children?: Snippet;
	}

	let { value = $bindable(''), variant = 'line', class: className, children }: Props = $props();

	const id = uid('tabs');

	setContext<TabsContext>(TABS, {
		get value() {
			return value;
		},
		get variant() {
			return variant;
		},
		id,
		select: (next: string) => (value = next)
	});
</script>

<div class={cn('flex flex-col gap-4', className)}>
	{@render children?.()}
</div>
