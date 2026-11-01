<!-- Anything in trailing stays clickable; leading is decoration only. -->
<script lang="ts">
	import { Input, Kbd } from '@joshicodes/cock';

	let query = $state('');
</script>

<div class="w-full max-w-sm">
	<Input bind:value={query} placeholder="Search, we won't judge" leading={icon} trailing={hint} />
</div>

{#snippet icon()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75" />
		<path d="m16 16 4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet hint()}
	<Kbd>/</Kbd>
{/snippet}
