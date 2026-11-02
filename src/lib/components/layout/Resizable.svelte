<script lang="ts" module>
	export interface ResizableContext {
		readonly direction: 'horizontal' | 'vertical';
		/** Adds a panel in document order and returns its index. */
		register: (panel: { size?: number; min: number; max: number }) => number;
		/** How many panels were registered before the caller, for handles. */
		readonly count: number;
		/** The panel's share of the group, in percent. */
		size: (index: number) => number;
		/** Moves the edge between panel `index` and the next one by `delta` percent. */
		resize: (index: number, delta: number) => void;
		readonly element: HTMLElement | undefined;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { RESIZABLE } from '../../utils/context.js';

	interface Props {
		direction?: 'horizontal' | 'vertical';
		class?: string;
		/** Called with every panel's size, in percent, after each change. */
		onresize?: (sizes: number[]) => void;
		/** `ResizablePanel`s with a `ResizableHandle` between each pair. */
		children?: Snippet;
	}

	let { direction = 'horizontal', class: className, onresize, children }: Props = $props();

	let element = $state<HTMLElement>();
	let panels = $state<{ size?: number; min: number; max: number }[]>([]);
	/** Set once something has been dragged; until then sizes come from the props. */
	let dragged = $state<number[] | null>(null);

	// Panels without a size share whatever the sized ones leave.
	let sizes = $derived.by(() => {
		if (dragged) return dragged;
		const given = panels.reduce((sum, panel) => sum + (panel.size ?? 0), 0);
		const open = panels.filter((panel) => panel.size === undefined).length;
		const fill = open ? Math.max(0, 100 - given) / open : 0;
		return panels.map((panel) => panel.size ?? fill);
	});

	setContext<ResizableContext>(RESIZABLE, {
		get direction() {
			return direction;
		},
		register(panel) {
			panels.push(panel);
			return panels.length - 1;
		},
		get count() {
			return panels.length;
		},
		size: (index) => sizes[index] ?? 0,
		resize(index, delta) {
			const next = [...sizes];
			const a = panels[index];
			const b = panels[index + 1];
			if (!a || !b) return;
			const pair = next[index] + next[index + 1];
			// Clamp against both panels' limits, so neither is pushed past its own.
			const lower = Math.max(a.min, pair - b.max);
			const upper = Math.min(a.max, pair - b.min);
			next[index] = Math.min(upper, Math.max(lower, next[index] + delta));
			next[index + 1] = pair - next[index];
			dragged = next;
			onresize?.(next);
		},
		get element() {
			return element;
		}
	});
</script>

<div
	bind:this={element}
	class={cn(
		'flex size-full overflow-hidden',
		direction === 'vertical' ? 'flex-col' : 'flex-row',
		className
	)}
>
	{@render children?.()}
</div>
