<!-- Field hands over the id and the aria wiring, as with any other control. With a name it also submits like one. -->
<script lang="ts">
	import { Combobox, Field } from '@joshicodes/cock';

	let partner = $state('');

	const coop = [
		{ value: 'doris', label: 'Doris' },
		{ value: 'gertrude', label: 'Gertrude' },
		{ value: 'henrietta', label: 'Henrietta' },
		{ value: 'mabel', label: 'Mabel' }
	];
</script>

<div class="w-full max-w-xs">
	<Field
		label="Tonight's lucky hen"
		description="He can only cover one coop at a time."
		error={partner === 'gertrude' ? 'Gertrude is broody and not in the mood.' : ''}
	>
		{#snippet children({ id, invalid, ...rest })}
			<Combobox
				{id}
				{invalid}
				{...rest}
				name="hen"
				options={coop}
				bind:value={partner}
				placeholder="Choose wisely"
			/>
		{/snippet}
	</Field>
</div>
