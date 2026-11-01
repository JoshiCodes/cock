<script lang="ts">
	import { Button, Checkbox, Drawer } from '@joshicodes/cock';

	let open = $state(false);
	let side = $state<'left' | 'right' | 'top' | 'bottom'>('right');

	function show(next: typeof side) {
		side = next;
		open = true;
	}
</script>

<div class="flex flex-wrap gap-3">
	{#each ['right', 'left', 'top', 'bottom'] as const as edge (edge)}
		<Button variant="outline" size="sm" onclick={() => show(edge)}>{edge}</Button>
	{/each}
</div>

<Drawer bind:open {side} title="Filters">
	<div class="space-y-3">
		<Checkbox checked>In stock</Checkbox>
		<Checkbox>On sale</Checkbox>
		<Checkbox>Free shipping</Checkbox>
		<Checkbox>Extra long</Checkbox>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Reset</Button>
		<Button onclick={() => (open = false)}>Apply</Button>
	{/snippet}
</Drawer>
