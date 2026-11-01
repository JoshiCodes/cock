<script lang="ts">
	import { Textarea } from '@joshicodes/cock';

	let notes = $state('');
</script>

<div class="w-full max-w-md">
	<Textarea
		bind:value={notes}
		placeholder="Grows as you type. Give it a moment."
		autosize
		rows={2}
	/>
</div>
