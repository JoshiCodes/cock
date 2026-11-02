<!-- One is rarely enough. Backspace in the empty input takes the last one back. -->
<script lang="ts">
	import { Combobox, type ComboboxOption } from '@joshicodes/cock';

	let wakeups = $state(['rooster', 'coffee']);

	const options: ComboboxOption[] = [
		{ value: 'rooster', label: 'The rooster' },
		{ value: 'coffee', label: 'Coffee' },
		{ value: 'alarm', label: 'An alarm', keywords: ['phone'] },
		{ value: 'sun', label: 'Sunlight', keywords: ['curtains'] },
		{ value: 'wood', label: 'Morning wood', keywords: ['carpentry', 'hobby'] },
		{ value: 'cat', label: 'The cat, sitting on your face' }
	];
</script>

<div class="w-full max-w-sm space-y-2">
	<Combobox
		{options}
		bind:value={wakeups}
		multiple
		placeholder="What gets you up?"
		empty="Nothing gets you up. See a doctor."
	/>
	<p class="text-sm text-fg-muted">
		{wakeups.length}
		{wakeups.length === 1 ? 'thing gets' : 'things get'} you up. Search “carpentry”; it is a hobby.
	</p>
</div>
