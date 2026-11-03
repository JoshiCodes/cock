<!-- Without search or selection it is a sortable Table. Dense and striped work as they do there. -->
<script lang="ts">
	import { DataTable, type DataTableColumn } from '@joshicodes/cock';

	interface Egg {
		id: string;
		day: string;
		nest: string;
		weight: number;
	}

	const log: Egg[] = [
		{ id: '1', day: 'Monday', nest: 'Box 1', weight: 61 },
		{ id: '2', day: 'Monday', nest: 'Box 3', weight: 64 },
		{ id: '3', day: 'Tuesday', nest: 'Flower bed', weight: 58 },
		{ id: '4', day: 'Wednesday', nest: 'Box 2', weight: 66 },
		{ id: '5', day: 'Thursday', nest: 'Under the tractor', weight: 59 }
	];

	const columns: DataTableColumn<Egg>[] = [
		{ key: 'day', header: 'Day' },
		{ key: 'nest', header: 'Nest', sortable: true },
		{ key: 'weight', header: 'Weight', sortable: true, align: 'right' }
	];
</script>

<DataTable
	rows={log}
	{columns}
	rowKey={(egg) => egg.id}
	pageSize={0}
	dense
	striped
	caption="Egg log, Coop 2. Sizes vary."
>
	{#snippet cell({ column, value })}
		{#if column.key === 'weight'}
			<span class="tabular-nums">{value} g</span>
		{:else}
			{value}
		{/if}
	{/snippet}
</DataTable>
