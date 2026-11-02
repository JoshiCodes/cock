<script lang="ts">
	import { Code } from '@joshicodes/cock';

	/**
	 * Catalog prose marks code with backticks, the way it would be written in a
	 * README. Every odd piece of the split sat between a pair of them.
	 */
	let { text }: { text: string } = $props();

	let parts = $derived(text.split('`'));
</script>

{#each parts as part, index (index)}{#if index % 2}<Code>{part}</Code>{:else}{part}{/if}{/each}
