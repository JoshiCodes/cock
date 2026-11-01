<!-- Click a row. Selection is yours to track; the component only styles it. -->
<script lang="ts">
	import { Avatar, Badge, Switch, Table } from '@joshicodes/cock';

	let accented = $state(true);
	let selected = $state<string[]>(['Mabel']);

	const flock = [
		{ name: 'Henrietta', breed: 'Orpington', status: 'Laying', eggs: 6 },
		{ name: 'Gertrude', breed: 'Sussex', status: 'Broody', eggs: 1 },
		{ name: 'Mabel', breed: 'Leghorn', status: 'Laying', eggs: 7 },
		{ name: 'Doris', breed: 'Silkie', status: 'Molting', eggs: 0 }
	];

	const tone = { Laying: 'success', Broody: 'warning', Molting: 'neutral' } as const;

	function toggle(name: string) {
		selected = selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name];
	}
</script>

<div class="w-full space-y-4">
	<Switch bind:checked={accented}>Accent</Switch>

	<Table tone={accented ? 'accent' : 'neutral'}>
		<thead>
			<tr>
				<th>Name</th>
				<th>Breed</th>
				<th>Status</th>
				<th class="text-right">Eggs this week</th>
			</tr>
		</thead>
		<tbody>
			{#each flock as hen (hen.name)}
				<tr
					aria-selected={selected.includes(hen.name)}
					onclick={() => toggle(hen.name)}
					class="cursor-pointer"
				>
					<td>
						<div class="flex items-center gap-2.5">
							<Avatar name={hen.name} size="xs" />
							<span class="font-medium">{hen.name}</span>
						</div>
					</td>
					<td class="text-fg-muted">{hen.breed}</td>
					<td><Badge variant={tone[hen.status as keyof typeof tone]}>{hen.status}</Badge></td>
					<td class="text-right tabular-nums">{hen.eggs}</td>
				</tr>
			{/each}
		</tbody>
	</Table>
</div>
