<!-- Next only moves on once validate says so. Finished steps can be clicked to go back; the ones ahead wait their turn. -->
<script lang="ts">
	import { Checkbox, Field, Input, Radio, RadioGroup, Stepper } from '@joshicodes/cock';

	let current = $state(0);
	let name = $state('');
	let crow = $state('dawn');
	let committed = $state(false);
	let tried = $state(false);
	let joined = $state(false);

	const steps = [
		{ title: 'About you', description: 'Name and comb' },
		{ title: 'Preferences', description: 'How you like it' },
		{ title: 'Commitment', description: 'No pulling out now' }
	];

	function validate(step: number) {
		tried = true;
		const ok = step === 0 ? name.trim().length > 0 : step === 2 ? committed : true;
		if (ok) tried = false;
		return ok;
	}

	async function finish() {
		await new Promise((resolve) => setTimeout(resolve, 900));
		joined = true;
	}
</script>

<div class="w-full max-w-xl">
	{#if joined}
		<p class="text-sm text-fg-muted">
			Welcome to the flock, {name}. Breakfast is at five, and you are it.
		</p>
	{:else}
		<Stepper {steps} bind:current {validate} onfinish={finish} finishLabel="Join the flock">
			{#snippet children({ current })}
				{#if current === 0}
					<Field
						label="Name"
						description="What the hens will scream."
						error={tried && !name.trim() ? 'Even roosters have names.' : undefined}
						required
					>
						{#snippet children({ id, invalid, ...rest })}
							<Input {id} {invalid} {...rest} bind:value={name} placeholder="Big Red" />
						{/snippet}
					</Field>
				{:else if current === 1}
					<RadioGroup bind:value={crow} label="When do you crow?">
						<Radio value="dawn" description="Reliable, if a little early">At dawn</Radio>
						<Radio value="whenever" description="Spontaneous. Exhausting."
							>Whenever I feel like it</Radio
						>
						<Radio value="audience">Only when someone is watching</Radio>
					</RadioGroup>
				{:else}
					<div class="space-y-2">
						<Checkbox bind:checked={committed}>I will stick around until the eggs hatch.</Checkbox>
						{#if tried && !committed}
							<p class="text-xs text-danger">They all say that. Tick it anyway.</p>
						{/if}
					</div>
				{/if}
			{/snippet}
		</Stepper>
	{/if}
</div>
