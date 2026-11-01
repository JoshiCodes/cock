<!-- fit fills the width; on a narrow screen the grid scrolls instead of shrinking. -->
<script lang="ts">
	import { Heatmap } from '@joshicodes/cock';

	// Seeded, so the picture is the same on every load.
	let seed = 7;
	const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const laid = Array.from({ length: 364 }, (_, day) => {
		const season = 0.35 + 0.65 * Math.sin((day / 364) * Math.PI);
		return random() < 0.08 ? 0 : Math.round(season * (6 + random() * 10));
	});
</script>

<Heatmap
	data={laid}
	fit
	describe={(eggs, day) => `${eggs} eggs on day ${day + 1}`}
	label="Eggs laid per day over the last year"
/>
