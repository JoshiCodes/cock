<!-- Pass an options array, or supply your own <option> elements as children. -->
<script lang="ts">
	import { Select } from '@joshicodes/cock';

	let framework = $state('sveltekit');

	const frameworks = [
		{ value: 'sveltekit', label: 'SvelteKit' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'vite', label: 'Vite' },
		{ value: 'next', label: 'Next.js', disabled: true }
	];
</script>

<div class="grid w-full gap-3 sm:grid-cols-2">
	<Select bind:value={framework} options={frameworks} />
	<Select placeholder="Pick a size" options={[{ value: 'l', label: 'Large' }]} />
</div>
