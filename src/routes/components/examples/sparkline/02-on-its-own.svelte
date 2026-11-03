<!-- Every option to play with. The dashed line is the baseline: a target, or last year's average. -->
<script lang="ts">
	import { Field, SegmentedControl, Slider, Sparkline, Switch } from '@joshicodes/cock';

	const eggs = [14, 17, 13, 19, 22, 18, 24, 21, 26, 23, 20, 27, 25, 29, 26, 31, 28, 30];

	let curve = $state<'linear' | 'smooth' | 'step'>('smooth');
	let colour = $state('text-accent');
	let fill = $state(true);
	let dot = $state(true);
	let target = $state(true);
	let fromZero = $state(false);
	let height = $state(96);
	let strokeWidth = $state(2);

	// Changing it replays the draw-in.
	let replay = $state(0);
</script>

<div class="w-full space-y-6">
	{#key replay}
		<Sparkline
			data={eggs}
			{curve}
			{fill}
			{dot}
			{height}
			{strokeWidth}
			baseline={target ? 24 : undefined}
			min={fromZero ? 0 : undefined}
			animate
			label="Eggs per day, up from 14 to 30 over two and a half weeks"
			class={colour}
		/>
	{/key}

	<div class="grid gap-5 sm:grid-cols-2">
		<Field label="Curve">
			<SegmentedControl
				bind:value={curve}
				size="sm"
				stretch
				options={[
					{ value: 'linear', label: 'Linear' },
					{ value: 'smooth', label: 'Smooth' },
					{ value: 'step', label: 'Step' }
				]}
			/>
		</Field>
		<Field label="Colour">
			<SegmentedControl
				bind:value={colour}
				size="sm"
				stretch
				options={[
					{ value: 'text-accent', label: 'Accent' },
					{ value: 'text-success', label: 'Success' },
					{ value: 'text-danger', label: 'Danger' },
					{ value: 'text-fg-muted', label: 'Muted' }
				]}
			/>
		</Field>
		<Slider
			bind:value={height}
			min={32}
			max={160}
			step={8}
			label="Height"
			showValue
			format={(v) => `${v} px`}
		/>
		<Slider
			bind:value={strokeWidth}
			min={1}
			max={4}
			step={0.25}
			label="Stroke width"
			showValue
			format={(v) => `${v} px`}
		/>
	</div>

	<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
		<Switch bind:checked={fill}>Fill</Switch>
		<Switch bind:checked={dot}>End dot</Switch>
		<Switch bind:checked={target}>Target line</Switch>
		<Switch bind:checked={fromZero}>Scale from 0</Switch>
		<button
			type="button"
			onclick={() => replay++}
			class="cursor-pointer text-sm text-fg-muted transition-colors hover:text-fg"
		>
			Replay animation
		</button>
	</div>
</div>
