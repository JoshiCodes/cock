<script lang="ts">
	import { Alert, Button } from '@joshicodes/cock';

	let dismissed = $state(false);
</script>

<div class="flex w-full flex-col gap-4">
	<Alert variant="info" title="Scheduled maintenance">
		Saturday from 02:00 to 03:00 UTC. Things might go down for a bit.
	</Alert>
	<Alert variant="success" title="Payment received">
		Thanks. A receipt is on its way, nice and discreet.
	</Alert>
	<Alert variant="warning" title="Storage almost full">
		You have used 9.2 GB of 10 GB. Size does matter, apparently.
	</Alert>

	{#if !dismissed}
		<Alert variant="danger" title="Fox spotted near the coop" ondismiss={() => (dismissed = true)}>
			Doors are closed. Headcount in progress.
		</Alert>
	{:else}
		<Button variant="ghost" size="sm" onclick={() => (dismissed = false)}>Bring the fox back</Button
		>
	{/if}

	<Alert>Nothing to report. A plain alert for quiet context.</Alert>
</div>
