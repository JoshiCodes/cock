<script lang="ts">
	import {
		Avatar,
		Badge,
		Button,
		Card,
		DropdownMenu,
		Heatmap,
		MenuItem,
		Switch,
		Sparkline,
		Stat,
		Table,
		toast
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './Data.svelte?raw';
	import Demo from '../Demo.svelte';

	const flock = [
		{ name: 'Henrietta', breed: 'Orpington', status: 'Laying', eggs: 6, seen: 'Just now' },
		{ name: 'Gertrude', breed: 'Sussex', status: 'Broody', eggs: 1, seen: '10 min ago' },
		{ name: 'Mabel', breed: 'Leghorn', status: 'Laying', eggs: 7, seen: '1 h ago' },
		{ name: 'Doris', breed: 'Silkie', status: 'Molting', eggs: 0, seen: 'Under the shed' }
	];

	const tone = { Laying: 'success', Broody: 'warning', Molting: 'neutral' } as const;

	let selected = $state<string[]>(['Mabel']);
	let accented = $state(true);

	function toggle(name: string) {
		selected = selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name];
	}

	const trends = [
		{
			label: 'Eggs per day',
			value: '21',
			summary: 'Rising steadily over two weeks',
			data: [12, 14, 13, 15, 16, 15, 17, 18, 17, 19, 20, 19, 21, 21],
			class: 'text-accent'
		},
		{
			label: 'Fox sightings',
			value: '3 this week',
			summary: 'A spike midweek, quiet again since',
			data: [0, 0, 1, 0, 0, 2, 4, 3, 1, 0, 0, 0, 1, 0],
			class: 'text-danger'
		},
		{
			label: 'Coop temperature',
			value: '18 °C',
			summary: 'Steady',
			data: [18, 18.4, 17.9, 18.2, 18.1, 18.6, 18.2, 18, 18.5, 18.3, 18.1, 18.4, 18.2, 18.2],
			class: 'text-fg-muted'
		}
	];

	// A year of eggs. Seeded, so the picture is the same on every load.
	let seed = 7;
	const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const laid = Array.from({ length: 364 }, (_, day) => {
		const season = 0.35 + 0.65 * Math.sin((day / 364) * Math.PI);
		return random() < 0.08 ? 0 : Math.round(season * (6 + random() * 10));
	});
</script>

<Section
	{source}
	id="data"
	title="Data"
	description="Table only styles plain thead and tbody markup. Sorting and selection are left out on purpose: every project wants them slightly differently. Big numbers, no exaggeration."
>
	<Demo title="Stat" layout="bare">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Stat label="Eggs this week" value="142" change="+12" trend="up" hint="vs last week" />
			<Stat label="Average weight" value="63 g" change="+2 g" trend="up" hint="above average" />
			<Stat label="Lost to foxes" value="1" change="+1" trend="down" hint="this month" />
			<Stat label="Water left" value="82%" change="0%" trend="flat" />
		</div>
	</Demo>

	<Demo
		title="Sparkline"
		description="A trend without a chart library. Stretches to fill its container."
		layout="bare"
	>
		<div class="grid gap-4 sm:grid-cols-3">
			{#each trends as trend (trend.label)}
				<Card padding="md">
					<p class="text-sm text-fg-muted">{trend.label}</p>
					<p class="mt-1 mb-3 text-2xl font-semibold text-fg tabular-nums">{trend.value}</p>
					<Sparkline data={trend.data} height={40} label={trend.summary} class={trend.class} />
				</Card>
			{/each}
		</div>
	</Demo>

	<Demo
		title="Heatmap"
		description="One cell per day, shaded with the accent. With fit it fills the width. Hover a cell for its value."
		layout="bare"
	>
		<Heatmap
			data={laid}
			fit
			describe={(eggs, day) => `${eggs} eggs on day ${day + 1}`}
			label="Eggs laid per day over the last year"
		/>
	</Demo>

	<Demo
		title="Table"
		description="tone='accent' carries the theme into the header and rows. Click a row to select it."
		layout="bare"
	>
		<Switch bind:checked={accented} class="mb-4">Accent</Switch>

		<Table tone={accented ? 'accent' : 'neutral'}>
			<thead>
				<tr>
					<th>Name</th>
					<th>Breed</th>
					<th>Status</th>
					<th class="text-right">Eggs this week</th>
					<th>Last seen</th>
					<th><span class="sr-only">Actions</span></th>
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
						<td class="text-xs whitespace-nowrap text-fg-muted">{hen.seen}</td>
						<td class="w-10">
							<DropdownMenu placement="bottom-end">
								{#snippet trigger(attrs)}
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Actions for {hen.name}"
										{...attrs}
									>
										<svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
											<circle cx="12" cy="5" r="1.6" />
											<circle cx="12" cy="12" r="1.6" />
											<circle cx="12" cy="19" r="1.6" />
										</svg>
									</Button>
								{/snippet}
								<MenuItem onselect={() => toast(`${hen.name} renamed`)}>Rename</MenuItem>
								<MenuItem onselect={() => toast(`${hen.name} moved`)}>Move to coop 2</MenuItem>
							</DropdownMenu>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Demo>

	<Demo title="Dense and striped" layout="bare">
		<Table dense striped caption="Egg log, Coop 2. Sizes vary.">
			<thead>
				<tr>
					<th>Day</th>
					<th>Nest</th>
					<th class="text-right">Weight</th>
				</tr>
			</thead>
			<tbody>
				<tr><td>Monday</td><td>Box 1</td><td class="text-right tabular-nums">61 g</td></tr>
				<tr><td>Monday</td><td>Box 3</td><td class="text-right tabular-nums">64 g</td></tr>
				<tr><td>Tuesday</td><td>Flower bed</td><td class="text-right tabular-nums">58 g</td></tr>
				<tr><td>Tuesday</td><td>Box 2</td><td class="text-right tabular-nums">71 g</td></tr>
			</tbody>
		</Table>
	</Demo>
</Section>
