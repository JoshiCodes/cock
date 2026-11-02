<script lang="ts" module>
	export type SortDirection = 'asc' | 'desc';

	export interface DataTableSort {
		key: string;
		direction: SortDirection;
	}

	export interface DataTableColumn<T> {
		/** Identifies the column; also read off the row when there is no `value`. */
		key: string;
		header: string;
		/** What the column shows, sorts and filters by. Defaults to `row[key]`. */
		value?: (row: T) => string | number | Date | null | undefined;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		/** Classes for the header and every cell of the column. */
		class?: string;
	}
</script>

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing } from '../../utils/styles.js';
	import Table from './Table.svelte';
	import Checkbox from '../forms/Checkbox.svelte';
	import Pagination from '../navigation/Pagination.svelte';

	interface Props {
		rows: T[];
		columns: DataTableColumn<T>[];
		/** A stable id per row. Selection is tracked by it. */
		rowKey: (row: T) => string;
		sort?: DataTableSort | null;
		/** Keeps only rows where some column contains this text. */
		query?: string;
		/** Adds a checkbox column. */
		selectable?: boolean;
		/** Keys of the selected rows. */
		selected?: string[];
		/** Rows per page. 0 shows them all. */
		pageSize?: number;
		page?: number;
		/** Shown when no row survives the query. */
		empty?: string;
		tone?: 'neutral' | 'accent';
		dense?: boolean;
		striped?: boolean;
		caption?: string;
		class?: string;
		/** Custom rendering for a cell; switch on `column.key`. */
		cell?: Snippet<[{ row: T; column: DataTableColumn<T>; value: unknown }]>;
	}

	let {
		rows,
		columns,
		rowKey,
		sort = $bindable(null),
		query = '',
		selectable = false,
		selected = $bindable([]),
		pageSize = 10,
		page = $bindable(1),
		empty = 'Nothing to show.',
		tone = 'neutral',
		dense = false,
		striped = false,
		caption,
		class: className,
		cell
	}: Props = $props();

	function read(row: T, column: DataTableColumn<T>) {
		return column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
	}

	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	function compare(a: unknown, b: unknown) {
		// Blank values go last whichever way the column is sorted.
		if (a == null || a === '') return b == null || b === '' ? 0 : 1;
		if (b == null || b === '') return -1;
		if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
		if (typeof a === 'number' && typeof b === 'number') return a - b;
		return collator.compare(String(a), String(b));
	}

	let filtered = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return rows;
		return rows.filter((row) =>
			columns.some((column) => {
				const value = read(row, column);
				return value != null && String(value).toLowerCase().includes(needle);
			})
		);
	});

	let sorted = $derived.by(() => {
		const column = sort && columns.find((c) => c.key === sort!.key);
		if (!sort || !column) return filtered;
		const sign = sort.direction === 'asc' ? 1 : -1;
		return [...filtered].sort((a, b) => {
			const va = read(a, column);
			const vb = read(b, column);
			const blank = (v: unknown) => v == null || v === '';
			// Keep the blanks at the bottom instead of flipping them to the top.
			if (blank(va) || blank(vb)) return compare(va, vb);
			return sign * compare(va, vb);
		});
	});

	let pages = $derived(pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1);

	// A shorter result after filtering should not leave the table on a page that no longer exists.
	$effect(() => {
		if (page > pages) page = pages;
	});

	let visible = $derived(
		pageSize > 0 ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted
	);

	let filteredKeys = $derived(filtered.map(rowKey));
	let selectedHere = $derived(filteredKeys.filter((key) => selected.includes(key)).length);
	let allSelected = $derived(filteredKeys.length > 0 && selectedHere === filteredKeys.length);

	function toggleAll() {
		selected = allSelected
			? selected.filter((key) => !filteredKeys.includes(key))
			: [...new Set([...selected, ...filteredKeys])];
	}

	function toggle(key: string) {
		selected = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
	}

	/** Ascending, descending, then back to the order the rows came in. */
	function cycle(column: DataTableColumn<T>) {
		if (sort?.key !== column.key) sort = { key: column.key, direction: 'asc' };
		else if (sort.direction === 'asc') sort = { key: column.key, direction: 'desc' };
		else sort = null;
		page = 1;
	}

	const aligns = { left: 'text-left', center: 'text-center', right: 'text-right' };
	const justify = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };

	let first = $derived(sorted.length ? (page - 1) * pageSize + 1 : 0);
	let last = $derived(Math.min(sorted.length, page * pageSize));
</script>

<div class={cn('w-full space-y-3', className)}>
	<Table {tone} {dense} {striped} {caption}>
		<thead>
			<tr>
				{#if selectable}
					<th class="w-px">
						<Checkbox
							aria-label="Select all rows"
							checked={allSelected}
							indeterminate={selectedHere > 0 && !allSelected}
							disabled={filteredKeys.length === 0}
							onchange={toggleAll}
						/>
					</th>
				{/if}
				{#each columns as column (column.key)}
					{@const active = sort?.key === column.key ? sort : null}
					<th
						aria-sort={column.sortable
							? active
								? active.direction === 'asc'
									? 'ascending'
									: 'descending'
								: 'none'
							: undefined}
						class={cn(aligns[column.align ?? 'left'], column.class)}
					>
						{#if column.sortable}
							<button
								type="button"
								onclick={() => cycle(column)}
								class={cn(
									'-mx-1 inline-flex cursor-pointer items-center gap-1 rounded px-1 hover:text-fg',
									justify[column.align ?? 'left'],
									active && 'text-fg',
									focusRing
								)}
							>
								{column.header}
								<svg
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
									class={cn('size-3.5 shrink-0', !active && 'opacity-40')}
								>
									{#if !active}
										<path
											d="m8 9 4-4 4 4M8 15l4 4 4-4"
											stroke="currentColor"
											stroke-width="1.75"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									{:else if active.direction === 'asc'}
										<path
											d="m7 14 5-5 5 5"
											stroke="currentColor"
											stroke-width="1.75"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									{:else}
										<path
											d="m7 10 5 5 5-5"
											stroke="currentColor"
											stroke-width="1.75"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									{/if}
								</svg>
							</button>
						{:else}
							{column.header}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>

		<tbody>
			{#each visible as row (rowKey(row))}
				{@const key = rowKey(row)}
				{@const isSelected = selected.includes(key)}
				<tr aria-selected={selectable ? isSelected : undefined}>
					{#if selectable}
						<td class="w-px">
							<Checkbox aria-label="Select row" checked={isSelected} onchange={() => toggle(key)} />
						</td>
					{/if}
					{#each columns as column (column.key)}
						{@const value = read(row, column)}
						<td class={cn(aligns[column.align ?? 'left'], column.class)}>
							{#if cell}
								{@render cell({ row, column, value })}
							{:else if value instanceof Date}
								{value.toLocaleDateString()}
							{:else}
								{value ?? ''}
							{/if}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td
						colspan={columns.length + (selectable ? 1 : 0)}
						class="py-8 text-center text-fg-muted"
					>
						{empty}
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	{#if pageSize > 0 && sorted.length > pageSize}
		<div class="flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm text-fg-muted tabular-nums">
				{first}–{last} of {sorted.length}
			</p>
			<Pagination bind:page total={pages} />
		</div>
	{/if}
</div>
