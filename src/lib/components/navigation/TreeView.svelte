<script lang="ts" module>
	export interface TreeNode {
		id: string;
		label: string;
		children?: TreeNode[];
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';

	interface Props {
		items: TreeNode[];
		/** Ids of the open branches. */
		expanded?: string[];
		/** Id of the selected node. */
		selected?: string | null;
		/** Names the tree for screen readers. */
		label?: string;
		class?: string;
		onselect?: (node: TreeNode) => void;
		/** Custom rendering for a row's content; the chevron stays. */
		item?: Snippet<[TreeNode, { expanded: boolean; selected: boolean }]>;
	}

	let {
		items,
		expanded = $bindable([]),
		selected = $bindable(null),
		label = 'Tree',
		class: className,
		onselect,
		item
	}: Props = $props();

	interface Row {
		node: TreeNode;
		parent: TreeNode | null;
		level: number;
	}

	/** The rows a sighted person can see right now, top to bottom. */
	let rows = $derived.by(() => {
		const out: Row[] = [];
		const walk = (nodes: TreeNode[], parent: TreeNode | null, level: number) => {
			for (const node of nodes) {
				out.push({ node, parent, level });
				if (node.children?.length && expanded.includes(node.id)) {
					walk(node.children, node, level + 1);
				}
			}
		};
		walk(items, null, 1);
		return out;
	});

	/** The one row in the tab order. */
	let focusId = $state<string | null>(null);
	let tabStop = $derived(
		rows.some((row) => row.node.id === focusId)
			? focusId
			: rows.some((row) => row.node.id === selected)
				? selected
				: (rows[0]?.node.id ?? null)
	);

	let tree = $state<HTMLUListElement>();

	async function focus(id: string) {
		focusId = id;
		await tick();
		tree?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus();
	}

	const isBranch = (node: TreeNode) => Boolean(node.children?.length);
	const isOpen = (node: TreeNode) => expanded.includes(node.id);

	function toggle(node: TreeNode, open = !isOpen(node)) {
		if (!isBranch(node)) return;
		expanded = open
			? [...new Set([...expanded, node.id])]
			: expanded.filter((id) => id !== node.id);
	}

	function choose(node: TreeNode) {
		if (node.disabled) return;
		selected = node.id;
		onselect?.(node);
	}

	let typed = '';
	let typedAt = 0;

	function onkeydown(event: KeyboardEvent) {
		const index = rows.findIndex((row) => row.node.id === tabStop);
		const row = rows[index];
		if (!row) return;
		const { node } = row;

		switch (event.key) {
			case 'ArrowDown':
				if (rows[index + 1]) focus(rows[index + 1].node.id);
				break;
			case 'ArrowUp':
				if (rows[index - 1]) focus(rows[index - 1].node.id);
				break;
			case 'ArrowRight':
				if (!isBranch(node)) break;
				if (!isOpen(node)) toggle(node, true);
				else focus(node.children![0].id);
				break;
			case 'ArrowLeft':
				if (isBranch(node) && isOpen(node)) toggle(node, false);
				else if (row.parent) focus(row.parent.id);
				break;
			case 'Home':
				focus(rows[0].node.id);
				break;
			case 'End':
				focus(rows[rows.length - 1].node.id);
				break;
			case 'Enter':
			case ' ':
				choose(node);
				if (isBranch(node) && event.key === 'Enter') toggle(node);
				break;
			case '*': {
				// Opens every branch on the same level, as the ARIA pattern asks.
				const siblings = row.parent ? row.parent.children! : items;
				expanded = [...new Set([...expanded, ...siblings.filter(isBranch).map((s) => s.id)])];
				break;
			}
			default: {
				if (event.key.length !== 1 || event.metaKey || event.ctrlKey || event.altKey) return;
				// Typing jumps to the next row starting with what was typed.
				const now = Date.now();
				typed = now - typedAt < 600 ? typed + event.key.toLowerCase() : event.key.toLowerCase();
				typedAt = now;
				const order = [...rows.slice(index + 1), ...rows.slice(0, index + 1)];
				const match =
					order.find((r) => r.node.label.toLowerCase().startsWith(typed)) ??
					order.find((r) => r.node.label.toLowerCase().startsWith(typed[0]));
				if (match) focus(match.node.id);
				break;
			}
		}
		event.preventDefault();
	}
</script>

{#snippet branch(nodes: TreeNode[], level: number)}
	{#each nodes as node, index (node.id)}
		{@const open = isOpen(node)}
		{@const isSelected = selected === node.id}
		<li
			role="treeitem"
			data-id={node.id}
			tabindex={tabStop === node.id ? 0 : -1}
			aria-level={level}
			aria-setsize={nodes.length}
			aria-posinset={index + 1}
			aria-expanded={isBranch(node) ? open : undefined}
			aria-selected={isSelected}
			aria-disabled={node.disabled || undefined}
			onfocus={() => (focusId = node.id)}
			class="group/item outline-none"
		>
			<!-- The keyboard is handled on the tree; rows only need the pointer. -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				onclick={(event) => {
					event.stopPropagation();
					focus(node.id);
					choose(node);
					toggle(node);
				}}
				style:padding-left="{(level - 1) * 1.125 + 0.375}rem"
				class={cn(
					'flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-2 text-sm select-none',
					transition,
					'group-focus-visible/item:outline-2 group-focus-visible/item:-outline-offset-2 group-focus-visible/item:outline-accent',
					isSelected ? 'bg-accent/12 text-fg' : 'text-fg-muted hover:bg-muted hover:text-fg',
					node.disabled && 'pointer-events-none opacity-50'
				)}
			>
				{#if isBranch(node)}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
						class={cn(
							'size-3.5 shrink-0 text-fg-subtle transition-transform duration-150',
							open && 'rotate-90'
						)}
					>
						<path
							d="m10 7 5 5-5 5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{:else}
					<span class="size-3.5 shrink-0" aria-hidden="true"></span>
				{/if}

				<span class="min-w-0 flex-1 truncate">
					{#if item}
						{@render item(node, { expanded: open, selected: isSelected })}
					{:else}
						{node.label}
					{/if}
				</span>
			</div>

			{#if isBranch(node) && open}
				<ul role="group">
					{@render branch(node.children!, level + 1)}
				</ul>
			{/if}
		</li>
	{/each}
{/snippet}

<ul bind:this={tree} role="tree" aria-label={label} {onkeydown} class={cn('space-y-px', className)}>
	{@render branch(items, 1)}
</ul>
