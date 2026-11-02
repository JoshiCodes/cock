<!-- Thin scrollbars in the theme's colours, and a shadow on whichever edge still has more to give. -->
<script lang="ts">
	import { ScrollArea } from '@joshicodes/cock';

	const hens = ['Doris', 'Gertrude', 'Henrietta', 'Mabel', 'Pearl', 'Agatha', 'Beatrice'];
	const log = Array.from({ length: 40 }, (_, i) => ({
		day: i + 1,
		hen: hens[(i * 5) % hens.length],
		eggs: (i * 7) % 4
	}));

	const positions = [
		'On top',
		'From behind',
		'Sideways',
		'Wheelbarrow',
		'Reverse rooster',
		'The lazy perch',
		'Flapping eagle',
		'Missionary (strictly for the eggs)'
	];
</script>

<div class="grid w-full gap-6 sm:grid-cols-2">
	<ScrollArea label="Laying log" class="max-h-64 rounded-lg border border-border">
		<table class="w-full text-sm">
			<thead class="sticky top-0 bg-surface text-left text-xs text-fg-subtle">
				<tr
					><th class="px-3 py-2 font-medium">Day</th><th class="font-medium">Hen</th><th
						class="pr-3 text-right font-medium">Eggs</th
					></tr
				>
			</thead>
			<tbody>
				{#each log as row (row.day)}
					<tr class="border-t border-border">
						<td class="px-3 py-1.5 text-fg-muted tabular-nums">{row.day}</td>
						<td class="text-fg">{row.hen}</td>
						<td class="pr-3 text-right tabular-nums">{row.eggs || 'Headache'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</ScrollArea>

	<div class="min-w-0 space-y-2 self-start">
		<p class="text-sm text-fg-muted">Popular positions on the perch:</p>
		<ScrollArea
			orientation="horizontal"
			label="Perching positions"
			class="rounded-lg border border-border"
		>
			<div class="flex w-max gap-2 p-3">
				{#each positions as position (position)}
					<span class="rounded-md bg-muted px-2.5 py-1 text-sm whitespace-nowrap">{position}</span>
				{/each}
			</div>
		</ScrollArea>
	</div>
</div>
