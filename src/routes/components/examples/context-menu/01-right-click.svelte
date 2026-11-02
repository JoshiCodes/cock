<!-- Right-click the coop, or focus it and press Shift+F10. It likes it when you take the initiative. -->
<script lang="ts">
	import { ContextMenu, MenuItem, MenuLabel, MenuSeparator } from '@joshicodes/cock';

	let status = $state('Mabel is minding her own business.');
</script>

<ContextMenu
	tabindex={0}
	class="flex h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border-strong text-center text-sm text-fg-muted outline-none select-none focus-visible:border-accent"
>
	<p class="max-w-56">{status}</p>

	{#snippet menu()}
		<MenuLabel>Mabel</MenuLabel>
		<MenuItem hint="E" onselect={() => (status = 'Seven eggs. She has been busy.')}>
			Collect eggs
		</MenuItem>
		<MenuItem onselect={() => (status = 'Moved to the coop with the better view.')}>
			Move to the other coop
		</MenuItem>
		<MenuItem onselect={() => (status = 'The rooster has been notified. He is ready.')}>
			Introduce to the rooster
		</MenuItem>
		<MenuItem disabled>Ask for her opinion</MenuItem>
		<MenuSeparator />
		<MenuItem variant="danger" onselect={() => (status = 'Nice try. Mabel has a lawyer.')}>
			Send to the soup
		</MenuItem>
	{/snippet}
</ContextMenu>
