<!-- `animation="lift"` raises the dots near the pointer off the page, on a spring, and sets them back down. `lift` sets how high. -->
<script lang="ts">
	import { GridBackground, Slider } from '@joshicodes/cock';

	let lift = $state(3);
</script>

<div class="w-full space-y-4">
	<GridBackground
		variant="dots"
		animation="lift"
		{lift}
		size={22}
		radius={140}
		class="h-72 w-full rounded-md border border-border"
	/>
	<Slider bind:value={lift} min={1} max={6} step={0.1} label="Lift" class="max-w-xs" />
</div>
