<!-- Type to narrow it down. Case and accents are ignored, so it does not care how you put it. -->
<script lang="ts">
	import { Combobox, type ComboboxOption } from '@joshicodes/cock';

	let breed = $state('leghorn');

	const breeds: ComboboxOption[] = [
		{ value: 'australorp', label: 'Australorp', keywords: ['black', 'layer'] },
		{ value: 'brahma', label: 'Brahma', keywords: ['big', 'feathered feet'] },
		{ value: 'cochin', label: 'Cochin', disabled: true },
		{ value: 'leghorn', label: 'Leghorn', keywords: ['white', 'layer'] },
		{ value: 'marans', label: 'Marans', keywords: ['dark eggs'] },
		{ value: 'orpington', label: 'Orpington', keywords: ['buff'] },
		{ value: 'plymouth-rock', label: 'Plymouth Rock', keywords: ['barred'] },
		{ value: 'rhode-island-red', label: 'Rhode Island Red', keywords: ['brown eggs'] },
		{ value: 'silkie', label: 'Silkie', keywords: ['fluffy', 'bantam'] },
		{ value: 'sussex', label: 'Sussex' },
		{ value: 'wyandotte', label: 'Wyandotte', keywords: ['laced'] }
	];
</script>

<div class="w-full max-w-xs space-y-2">
	<Combobox options={breeds} bind:value={breed} placeholder="Pick your cock" clearable />
	<p class="text-sm text-fg-muted">
		{breed ? `Going home with a ${breeds.find((b) => b.value === breed)?.label}.` : 'Still single.'}
		Try typing “layer”, or ask for the Cochin, who is fully booked.
	</p>
</div>
