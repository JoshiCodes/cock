<!-- Click a header to sort, a second time to flip it, a third to undo. Selection survives sorting, searching and paging. -->
<script lang="ts">
	import { Badge, DataTable, Input, Switch, type DataTableColumn } from '@joshicodes/cock';

	interface Bird {
		id: string;
		name: string;
		breed: string;
		eggs: number;
		joined: Date;
		status: 'Laying' | 'Broody' | 'Molting' | 'Rooster';
	}

	const names = [
		['Cluck Norris', 'Brahma'],
		['Hen Solo', 'Leghorn'],
		['Eggatha Christie', 'Orpington'],
		['Mother Clucker', 'Sussex'],
		['Cocky Balboa', 'Rhode Island Red'],
		['Princess Lay-a', 'Silkie'],
		['Henny Penny', 'Wyandotte'],
		['Attila the Hen', 'Marans'],
		['Albert Eggstein', 'Australorp'],
		['Hennifer Lopez', 'Leghorn'],
		['Gregory Peck', 'Cochin'],
		['Cluckleberry Finn', 'Plymouth Rock'],
		['Nugget', 'Silkie'],
		['Big Red', 'Rhode Island Red'],
		['Yolko Ono', 'Orpington'],
		['Mae West', 'Sussex'],
		['Chick Jagger', 'Brahma'],
		['Sir Lays-a-Lot', 'Australorp']
	];

	const statuses = ['Laying', 'Broody', 'Molting'] as const;

	const flock: Bird[] = names.map(([name, breed], i) => {
		const rooster = ['Cocky Balboa', 'Big Red', 'Chick Jagger', 'Gregory Peck'].includes(name);
		return {
			id: String(i + 1),
			name,
			breed,
			eggs: rooster ? 0 : (i * 37) % 180,
			joined: new Date(2024, (i * 5) % 12, 1 + ((i * 11) % 27)),
			status: rooster ? 'Rooster' : statuses[i % 3]
		};
	});

	const columns: DataTableColumn<Bird>[] = [
		{ key: 'name', header: 'Name', sortable: true, class: 'font-medium' },
		{ key: 'breed', header: 'Breed', sortable: true },
		{ key: 'status', header: 'Status' },
		{ key: 'eggs', header: 'Eggs this year', sortable: true, align: 'right' },
		{ key: 'joined', header: 'Joined', sortable: true, align: 'right' }
	];

	const tones = {
		Laying: 'success',
		Broody: 'warning',
		Molting: 'neutral',
		Rooster: 'accent'
	} as const;

	let accented = $state(true);
	let query = $state('');
	let selected = $state<string[]>([]);
</script>

<div class="w-full space-y-4">
	<Switch bind:checked={accented}>Accent</Switch>

	<div class="flex flex-wrap items-center justify-between gap-3">
		<Input bind:value={query} placeholder="Search the coop" class="max-w-60" />
		<p class="text-sm text-fg-muted">
			{selected.length
				? `${selected.length} picked for the photo shoot`
				: 'Nobody picked yet. Be gentle.'}
		</p>
	</div>

	<DataTable
		rows={flock}
		{columns}
		rowKey={(bird) => bird.id}
		{query}
		bind:selected
		selectable
		pageSize={6}
		tone={accented ? 'accent' : 'neutral'}
		empty="No bird by that name. Maybe they flew the coop."
	>
		{#snippet cell({ row, column, value })}
			{#if column.key === 'status'}
				<Badge variant={tones[row.status]} dot>{row.status}</Badge>
			{:else if column.key === 'eggs'}
				<span class="tabular-nums">{row.status === 'Rooster' ? 'Tries his best' : value}</span>
			{:else if column.key === 'joined'}
				<span class="text-fg-muted tabular-nums">
					{row.joined.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
				</span>
			{:else}
				{value}
			{/if}
		{/snippet}
	</DataTable>
</div>
