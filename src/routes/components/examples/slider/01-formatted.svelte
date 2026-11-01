<script lang="ts">
	import { Slider } from '@joshicodes/cock';

	let volume = $state(65);
</script>

<div class="w-full max-w-sm">
	<Slider bind:value={volume} label="Morning crow volume" showValue format={(v) => `${v}%`} />
</div>
