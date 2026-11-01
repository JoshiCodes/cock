<!-- The snippet gets the id and the aria wiring; spread the rest onto the control. -->
<script lang="ts">
	import { Field, Input, Select } from '@joshicodes/cock';

	let email = $state('');
	let country = $state('de');

	let error = $derived(
		email.length > 0 && !email.includes('@') ? 'That does not look like an email address.' : ''
	);

	const countries = [
		{ value: 'de', label: 'Germany' },
		{ value: 'at', label: 'Austria' },
		{ value: 'ch', label: 'Switzerland' }
	];
</script>

<div class="grid w-full gap-5 sm:grid-cols-2">
	<Field label="Email" description="Only used for receipts. Promise." {error} required>
		{#snippet children({ id, invalid, ...rest })}
			<Input
				{id}
				{invalid}
				{...rest}
				bind:value={email}
				type="email"
				placeholder="you@example.com"
			/>
		{/snippet}
	</Field>

	<Field label="Country" description="Decides the currency at checkout.">
		{#snippet children({ id, ...rest })}
			<Select {id} {...rest} bind:value={country} options={countries} />
		{/snippet}
	</Field>
</div>
