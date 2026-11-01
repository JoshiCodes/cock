<script lang="ts">
	import { Switch } from '@joshicodes/cock';

	let notifications = $state(true);
</script>

<div class="flex flex-col gap-4">
	<Switch bind:checked={notifications} description="Stays signed in for 30 days.">
		Keep it up
	</Switch>
	<Switch size="sm" aria-label="Compact switch" />
	<Switch disabled aria-label="Disabled switch" />
</div>
