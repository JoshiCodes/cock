<!-- The shortcut works anywhere on the page, not just when this demo has focus. -->
<script lang="ts">
	import {
		Button,
		CommandPalette,
		Kbd,
		confetti,
		formatHotkey,
		theme,
		toast,
		type Command
	} from '@joshicodes/cock';

	let open = $state(false);

	// Shortcut labels depend on the platform, so they are worked out in the browser.
	let shortcut = $state('Ctrl+K');
	$effect(() => {
		shortcut = formatHotkey('mod+k');
	});

	const commands: Command[] = [
		{
			id: 'new',
			label: 'New document',
			group: 'Files',
			hint: 'N',
			onselect: () => toast.success('Created')
		},
		{
			id: 'upload',
			label: 'Upload a file',
			group: 'Files',
			keywords: ['import'],
			onselect: () => toast('Choose a file…')
		},
		{
			id: 'mode',
			label: 'Toggle dark mode',
			group: 'Appearance',
			keywords: ['lights off'],
			onselect: () => theme.toggle()
		},
		{
			id: 'crow',
			label: 'Crow loudly',
			group: 'Other',
			keywords: ['confetti'],
			onselect: () => confetti()
		},
		{
			id: 'early',
			label: 'Finish early',
			group: 'Other',
			hint: 'Never',
			disabled: true,
			onselect: () => {}
		}
	];
</script>

<Button variant="outline" onclick={() => (open = true)}>
	Search commands
	<Kbd>{shortcut}</Kbd>
</Button>

<CommandPalette bind:open {commands} />
