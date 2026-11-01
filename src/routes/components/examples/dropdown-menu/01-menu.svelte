<script lang="ts">
	import {
		Button,
		DropdownMenu,
		MenuItem,
		MenuLabel,
		MenuSeparator,
		toast
	} from '@joshicodes/cock';
</script>

<DropdownMenu>
	{#snippet trigger(attrs)}
		<Button variant="outline" {...attrs}>Options</Button>
	{/snippet}

	<MenuLabel>Document</MenuLabel>
	<MenuItem icon={pencil} hint="E" onselect={() => toast('Editing')}>Edit</MenuItem>
	<MenuItem hint="D" onselect={() => toast('Duplicated')}>Duplicate</MenuItem>
	<MenuItem href="/components/dropdown-menu">Open in new tab</MenuItem>
	<MenuSeparator />
	<MenuItem variant="danger" onselect={() => toast.error('Deleted')}>Delete</MenuItem>
</DropdownMenu>

{#snippet pencil()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<path
			d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}
