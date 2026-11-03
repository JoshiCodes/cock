<script lang="ts">
	import { Card, Sparkline } from '@joshicodes/cock';

	const trends = [
		{
			label: 'Eggs per day',
			value: '21',
			summary: 'Rising steadily over two weeks',
			dot: true,
			data: [12, 14, 13, 15, 16, 15, 17, 18, 17, 19, 20, 19, 21, 21],
			class: 'text-accent'
		},
		{
			label: 'Fox sightings',
			value: '3 this week',
			summary: 'A spike midweek, quiet again since',
			dot: true,
			data: [0, 0, 1, 0, 0, 2, 4, 3, 1, 0, 0, 0, 1, 0],
			class: 'text-danger'
		},
		{
			label: 'Coop temperature',
			value: '18 °C',
			summary: 'Steady',
			data: [18, 18.4, 17.9, 18.2, 18.1, 18.6, 18.2, 18, 18.5, 18.3, 18.1, 18.4, 18.2, 18.2],
			class: 'text-fg-muted',
			// Nothing happened today worth pointing at.
			dot: false
		}
	];
</script>

<div class="grid w-full gap-4 sm:grid-cols-3">
	{#each trends as trend (trend.label)}
		<Card padding="md">
			<p class="text-sm text-fg-muted">{trend.label}</p>
			<p class="mt-1 mb-3 text-2xl font-semibold text-fg tabular-nums">{trend.value}</p>
			<Sparkline
				data={trend.data}
				dot={trend.dot}
				height={40}
				label={trend.summary}
				class={trend.class}
			/>
		</Card>
	{/each}
</div>
