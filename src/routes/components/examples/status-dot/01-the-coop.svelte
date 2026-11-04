<!-- With text next to it, the dot is decoration. The words carry the status for screen readers. -->
<script lang="ts">
	import { Card, StatusDot } from '@joshicodes/cock';
	import type { StatusTone } from '@joshicodes/cock';

	const systems: { name: string; tone: StatusTone; status: string }[] = [
		{ name: 'Rooster', tone: 'success', status: 'Up, and very proud of it' },
		{ name: 'Egg production', tone: 'success', status: 'Laying' },
		{ name: 'Feed dispenser', tone: 'warning', status: 'Running low' },
		{ name: 'Coop door', tone: 'danger', status: 'Stuck open' },
		{ name: 'Fox detection', tone: 'info', status: 'Scheduled maintenance' },
		{ name: 'Henhouse Wi-Fi', tone: 'neutral', status: 'Nobody knows' }
	];
</script>

<Card padding="none" class="w-full max-w-md divide-y divide-border">
	{#each systems as system (system.name)}
		<div class="flex items-center justify-between gap-4 px-4 py-3">
			<span class="text-sm font-medium text-fg">{system.name}</span>
			<StatusDot tone={system.tone} class="text-fg-muted">{system.status}</StatusDot>
		</div>
	{/each}
</Card>
