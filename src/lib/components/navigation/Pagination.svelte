<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';

	interface Props {
		page?: number;
		total: number;
		/** How many numbered buttons to show around the current page. */
		siblings?: number;
		class?: string;
		onchange?: (page: number) => void;
	}

	let { page = $bindable(1), total, siblings = 1, class: className, onchange }: Props = $props();

	function go(next: number) {
		const clamped = Math.min(total, Math.max(1, next));
		if (clamped === page) return;
		page = clamped;
		onchange?.(clamped);
	}

	let pages = $derived.by(() => {
		const result: (number | 'gap')[] = [];
		const from = Math.max(2, page - siblings);
		const to = Math.min(total - 1, page + siblings);

		result.push(1);
		if (from > 2) result.push('gap');
		for (let i = from; i <= to; i++) result.push(i);
		if (to < total - 1) result.push('gap');
		if (total > 1) result.push(total);

		return result;
	});

	const base =
		'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border px-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-40';
</script>

<nav aria-label="Pagination" class={cn('flex items-center gap-1', className)}>
	<button
		type="button"
		aria-label="Previous page"
		disabled={page <= 1}
		onclick={() => go(page - 1)}
		class={cn(base, 'border-border bg-surface text-fg-muted hover:bg-muted', transition, focusRing)}
	>
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
			<path
				d="m14 6-6 6 6 6"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	<!-- Numbered buttons need room; a phone gets the position instead. -->
	<span class="text-sm text-fg-muted tabular-nums sm:hidden">{page} / {total}</span>

	<span class="hidden items-center gap-1 sm:flex">
		{#each pages as item, index (index)}
			{#if item === 'gap'}
				<span class="px-1 text-sm text-fg-subtle">…</span>
			{:else}
				<button
					type="button"
					aria-current={item === page ? 'page' : undefined}
					onclick={() => go(item)}
					class={cn(
						base,
						transition,
						focusRing,
						item === page
							? 'border-accent bg-accent text-accent-fg'
							: 'border-border bg-surface text-fg-muted hover:bg-muted'
					)}
				>
					{item}
				</button>
			{/if}
		{/each}
	</span>

	<button
		type="button"
		aria-label="Next page"
		disabled={page >= total}
		onclick={() => go(page + 1)}
		class={cn(base, 'border-border bg-surface text-fg-muted hover:bg-muted', transition, focusRing)}
	>
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-4">
			<path
				d="m10 6 6 6-6 6"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</nav>
