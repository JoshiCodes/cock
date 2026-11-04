<!-- Anything that runs on a schedule and sometimes fails. Thinner bars, and it still lines up. -->
<script lang="ts">
	import { HistoryBar } from '@joshicodes/cock';
	import type { StatusTone } from '@joshicodes/cock';

	const jobs: { name: string; runs: (StatusTone | null)[] }[] = [
		{
			name: 'Nightly egg count',
			runs: Array.from({ length: 30 }, (_, i) => (i === 17 ? 'danger' : 'success'))
		},
		{
			name: 'Coop backup',
			runs: Array.from({ length: 30 }, (_, i) =>
				i % 7 === 3 ? 'info' : i === 24 ? 'warning' : 'success'
			)
		},
		{
			name: 'Deploy to the henhouse',
			runs: Array.from({ length: 30 }, (_, i) =>
				i < 20 ? null : i === 22 || i === 23 ? 'danger' : 'accent'
			)
		}
	];
</script>

<div class="w-full space-y-5">
	{#each jobs as job (job.name)}
		<div class="space-y-1.5">
			<p class="text-sm text-fg">{job.name}</p>
			<HistoryBar
				data={job.runs}
				height={20}
				gap={3}
				describe={(tone, i) => `Run ${i + 1}: ${tone ?? 'not scheduled'}`}
				label="{job.name}, last 30 runs"
			/>
		</div>
	{/each}
	<p class="text-xs text-fg-subtle">
		The deploy failed twice in a row. It happens to everyone, nobody talks about it.
	</p>
</div>
