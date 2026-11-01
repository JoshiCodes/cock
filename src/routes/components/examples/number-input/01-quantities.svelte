<!-- Type a letter into one of these, or scroll over it. Nothing jumps. -->
<script lang="ts">
	import { Field, NumberInput } from '@joshicodes/cock';

	let boxes = $state<number | null>(6);
	let temperature = $state<number | null>(18.5);
	let feed = $state<number | null>(null);
</script>

<div class="grid w-full gap-5 sm:grid-cols-3">
	<Field label="Nesting boxes" description="One per four hens.">
		<NumberInput bind:value={boxes} min={1} max={24} />
	</Field>

	<Field label="Coop temperature">
		<NumberInput bind:value={temperature} min={-10} max={40} step={0.5} unit="°C" />
	</Field>

	<Field label="Feed" description="Empty is null, not zero.">
		<NumberInput bind:value={feed} min={0} step={0.25} unit="kg" placeholder="—" />
	</Field>
</div>

<p class="mt-4 w-full font-mono text-xs text-fg-subtle">
	{JSON.stringify({ boxes, temperature, feed })}
</p>
