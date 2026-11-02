<!-- One section that opens and closes, with none of the Accordion bookkeeping. Bring your own trigger if the default is too plain. -->
<script lang="ts">
	import { Button, Collapsible } from '@joshicodes/cock';

	let details = $state(false);
</script>

<div class="w-full max-w-md space-y-6">
	<Collapsible title="What is in the feed?">
		<p class="mt-2 text-sm leading-relaxed text-fg-muted">
			Corn, wheat, a little oyster shell for the eggs, and whatever the rooster smuggles in. We do
			not ask.
		</p>
	</Collapsible>

	<Collapsible bind:open={details}>
		{#snippet trigger(attrs)}
			<Button variant="outline" size="sm" {...attrs}>
				{details ? 'Put it away' : 'Whip it out'}
			</Button>
		{/snippet}
		<p class="mt-3 text-sm leading-relaxed text-fg-muted">
			The full egg ledger: 1,284 this year, two double yolks, and one that nobody wants to talk
			about.
		</p>
	</Collapsible>
</div>
