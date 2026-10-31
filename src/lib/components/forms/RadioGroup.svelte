<script lang="ts" module>
	export interface RadioGroupContext {
		readonly name: string;
		readonly value: string;
		readonly disabled: boolean;
		select: (value: string) => void;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import { RADIO_GROUP } from '../../utils/context.js';

	interface Props {
		value?: string;
		name?: string;
		disabled?: boolean;
		orientation?: 'vertical' | 'horizontal';
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		name = uid('radio'),
		disabled = false,
		orientation = 'vertical',
		label,
		class: className,
		children
	}: Props = $props();

	setContext<RadioGroupContext>(RADIO_GROUP, {
		get name() {
			return name;
		},
		get value() {
			return value;
		},
		get disabled() {
			return disabled;
		},
		select: (next: string) => (value = next)
	});
</script>

<div
	role="radiogroup"
	aria-label={label}
	class={cn(
		'flex',
		orientation === 'vertical' ? 'flex-col gap-2.5' : 'flex-wrap items-center gap-5',
		className
	)}
>
	{@render children?.()}
</div>
