<script lang="ts">
	import { Button, CountUp } from '@joshicodes/cock';

	let eggs = $state(12840);
	let punctual = $state(99.95);
	let run = $state(0);
</script>

<div class="flex w-full flex-wrap items-end gap-10">
	{#key run}
		<div>
			<p class="text-sm text-fg-muted">Eggs since March</p>
			<p class="text-3xl font-semibold tracking-tight text-fg">
				<CountUp value={eggs} locale="en-US" />
			</p>
		</div>
		<div>
			<p class="text-sm text-fg-muted">Mornings he was on time</p>
			<p class="text-3xl font-semibold tracking-tight text-fg">
				<CountUp value={punctual} decimals={2} suffix="%" />
			</p>
		</div>
	{/key}

	<Button
		size="sm"
		variant="outline"
		onclick={() => {
			eggs = Math.round(8000 + Math.random() * 20000);
			punctual = 95 + Math.random() * 5;
		}}
	>
		New numbers
	</Button>
	<Button size="sm" variant="ghost" onclick={() => run++}>Replay</Button>
</div>
