<!-- Try adding a tag twice: the one you already have flashes instead of nothing happening. -->
<script lang="ts">
	import { TagInput } from '@joshicodes/cock';

	let interests = $state(['design', 'svelte', 'long walks']);
</script>

<div class="w-full max-w-md">
	<TagInput bind:value={interests} placeholder="Add an interest…" max={6} />
</div>
