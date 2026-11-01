<!-- appear replays it here; without it, content already on screen is left alone. -->
<script lang="ts">
	import { Button, Card, Reveal } from '@joshicodes/cock';

	let run = $state(0);
</script>

<div class="flex w-full flex-col gap-4">
	<div class="grid gap-4 sm:grid-cols-3">
		{#key run}
			{#each ['Foreplay', 'Build', 'Ship'] as step, index (step)}
				<Reveal delay={index * 120} appear>
					<Card padding="md">
						<p class="text-sm text-fg-muted">Step {index + 1}</p>
						<p class="mt-1 font-medium text-fg">{step}</p>
					</Card>
				</Reveal>
			{/each}
		{/key}
	</div>

	<Button size="sm" variant="outline" class="self-start" onclick={() => run++}>Replay</Button>
</div>
