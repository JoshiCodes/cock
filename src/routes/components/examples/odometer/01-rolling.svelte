<script lang="ts">
	import { Button, Odometer } from '@joshicodes/cock';

	let giggles = $state(1284);
</script>

<div class="flex w-full flex-wrap items-end gap-6">
	<div>
		<p class="text-sm text-fg-muted">People who giggled at the package name</p>
		<p class="text-4xl font-semibold tracking-tight text-fg">
			<Odometer value={giggles} />
		</p>
	</div>

	<Button size="sm" variant="outline" onclick={() => (giggles += 1)}>Another one</Button>
	<Button size="sm" variant="ghost" onclick={() => (giggles += 37)}>Read it out in a meeting</Button
	>
</div>
