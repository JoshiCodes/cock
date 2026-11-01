<!-- One stop in the tab order. The arrow keys move and select in one go. -->
<script lang="ts">
	import { Field, SegmentedControl } from '@joshicodes/cock';

	let range = $state('week');
	let layout = $state('grid');

	const ranges = [
		{ value: 'day', label: 'Day' },
		{ value: 'week', label: 'Week' },
		{ value: 'month', label: 'Month' },
		{ value: 'year', label: 'Year', disabled: true }
	];
</script>

<div class="w-full space-y-6">
	<SegmentedControl bind:value={range} options={ranges} label="Range" />

	<Field label="Layout" description="Stretched to the column.">
		<SegmentedControl
			bind:value={layout}
			size="sm"
			stretch
			options={[
				{ value: 'grid', label: 'Grid' },
				{ value: 'list', label: 'List' }
			]}
		/>
	</Field>

	<p class="font-mono text-xs text-fg-subtle">{range} · {layout}</p>
</div>
