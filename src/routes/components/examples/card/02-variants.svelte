<!-- Flat by default. Hover the raised one. -->
<script lang="ts">
	import { Card } from '@joshicodes/cock';

	const variants = [
		{ variant: 'default', note: 'A border, nothing else.' },
		{ variant: 'elevated', note: 'Sits a little higher than the rest.' },
		{ variant: 'raised', note: 'Hover it. It rises to the occasion.' },
		{ variant: 'flat', note: 'Filled, no outline.' }
	] as const;
</script>

<div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
	{#each variants as item (item.variant)}
		<Card variant={item.variant} padding="md">
			<p class="text-sm font-medium text-fg capitalize">{item.variant}</p>
			<p class="mt-1 text-sm text-fg-muted">{item.note}</p>
		</Card>
	{/each}
</div>
