<script lang="ts">
	import { Button, Terminal } from '@joshicodes/cock';

	let run = $state(0);
</script>

<div class="w-full space-y-4">
	{#key run}
		<Terminal
			title="~/farm"
			lines={[
				{ kind: 'command', text: 'bun run count-flock' },
				{ text: 'Coop 1  ......  6 hens', tone: 'muted' },
				{ text: 'Coop 2  ......  6 hens', tone: 'muted' },
				{ text: 'Rooster ......  on the roof again', tone: 'warning' },
				{ text: '12 of 12 accounted for', tone: 'success', delay: 600 }
			]}
		/>
	{/key}

	<Button size="sm" variant="outline" onclick={() => run++}>Replay</Button>
</div>
