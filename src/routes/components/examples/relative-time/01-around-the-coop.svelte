<!-- Leave the tab open: the top line keeps counting. Hover any of them for the exact time. -->
<script lang="ts">
	import { RelativeTime } from '@joshicodes/cock';

	const minute = 60_000;
	const loaded = Date.now();

	const events = [
		{ what: 'Rooster last crowed', at: loaded - 20_000 },
		{ what: 'Last egg', at: loaded - 47 * minute },
		{ what: 'Coop mucked out', at: loaded - 26 * 60 * minute },
		{ what: 'Fox last seen', at: loaded - 19 * 24 * 60 * minute },
		{ what: 'Next crow', at: loaded + 6 * 60 * minute }
	];
</script>

<dl class="grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2.5 text-sm">
	{#each events as event (event.what)}
		<dt class="text-fg-muted">{event.what}</dt>
		<dd class="text-right text-fg"><RelativeTime date={event.at} locale="en-US" /></dd>
	{/each}
</dl>
