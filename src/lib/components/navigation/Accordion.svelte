<script lang="ts" module>
	export interface AccordionContext {
		isOpen: (value: string) => boolean;
		toggle: (value: string) => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { ACCORDION } from '../../utils/context.js';

	interface Props {
		/** `single` closes the others when one opens. */
		type?: 'single' | 'multiple';
		/** Open item value(s). Bindable. */
		value?: string | string[];
		class?: string;
		children?: Snippet;
	}

	let {
		type = 'single',
		value = $bindable(type === 'single' ? '' : []),
		class: className,
		children
	}: Props = $props();

	setContext<AccordionContext>(ACCORDION, {
		isOpen: (item: string) => (Array.isArray(value) ? value.includes(item) : value === item),
		toggle: (item: string) => {
			if (Array.isArray(value)) {
				value = value.includes(item) ? value.filter((v) => v !== item) : [...value, item];
			} else {
				value = value === item ? '' : item;
			}
		}
	});
</script>

<div class={cn('divide-y divide-border rounded-lg border border-border', className)}>
	{@render children?.()}
</div>
