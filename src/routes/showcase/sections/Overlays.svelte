<script lang="ts">
	import {
		Button,
		Checkbox,
		CommandPalette,
		Drawer,
		DropdownMenu,
		Field,
		Input,
		Kbd,
		MenuItem,
		MenuLabel,
		MenuSeparator,
		Modal,
		Popover,
		Select,
		confetti,
		formatHotkey,
		theme,
		toast,
		type Command
	} from '#lib';
	import { goto } from '$app/navigation';
	import Section from '../Section.svelte';
	import { site } from '../site.svelte.js';
	import source from './Overlays.svelte?raw';
	import Demo from '../Demo.svelte';

	let confirmOpen = $state(false);
	let formOpen = $state(false);
	let drawerOpen = $state(false);
	let drawerSide = $state<'left' | 'right' | 'top' | 'bottom'>('right');
	let paletteOpen = $state(false);

	// Shortcut labels depend on the platform, so they are worked out in the browser.
	let shortcut = $state('Ctrl+K');
	$effect(() => {
		shortcut = formatHotkey('mod+k');
	});

	function openDrawer(side: typeof drawerSide) {
		drawerSide = side;
		drawerOpen = true;
	}

	const visibility = [
		{ value: 'private', label: 'Only me' },
		{ value: 'team', label: 'My team' },
		{ value: 'public', label: 'Anyone with the link' }
	];

	const commands: Command[] = [
		{
			id: 'new',
			label: 'New document',
			group: 'Files',
			hint: 'N',
			onselect: () => toast.success('Document created')
		},
		{
			id: 'upload',
			label: 'Upload a file',
			group: 'Files',
			keywords: ['import', 'attach'],
			onselect: () => toast('Choose a file…')
		},
		{
			id: 'recent',
			label: 'Recent files',
			group: 'Files',
			keywords: ['history', 'open'],
			onselect: () => toast('Nothing recent yet')
		},
		{
			id: 'mode',
			label: 'Toggle dark mode',
			group: 'Appearance',
			keywords: ['theme', 'light', 'night', 'lights off'],
			onselect: () => theme.toggle()
		},
		{
			id: 'customize',
			label: 'Customize the theme',
			group: 'Appearance',
			keywords: ['colour', 'accent'],
			onselect: () => (site.customizing = true)
		},
		{
			id: 'generator',
			label: 'Open the theme generator',
			group: 'Appearance',
			onselect: () => goto('/themes')
		},
		{
			id: 'crow',
			label: 'Crow loudly',
			group: 'Other',
			keywords: ['celebrate', 'confetti', 'party'],
			onselect: () => confetti()
		},
		{
			id: 'ego',
			label: 'Stroke the ego',
			group: 'Other',
			keywords: ['compliment', 'praise'],
			onselect: () => toast.success('Looking good', { description: 'Bigger than last time, too.' })
		},
		{
			id: 'early',
			label: 'Finish early',
			group: 'Other',
			hint: 'Never',
			disabled: true,
			onselect: () => {}
		},
		{
			id: 'rename',
			label: 'Rename the package',
			group: 'Other',
			disabled: true,
			onselect: () => {}
		}
	];
</script>

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

<Section
	{source}
	id="overlays"
	title="Overlays"
	description="Each one renders into <body> and positions itself against its trigger, which is why a scrolling table or an overflow-hidden card never cuts them off. Escape closes, focus goes back where it came from. They always end up on top."
>
	<Demo title="Modal">
		<Button variant="outline" onclick={() => (confirmOpen = true)}>Confirm dialog</Button>
		<Button variant="outline" onclick={() => (formOpen = true)}>Form dialog</Button>

		<Modal
			bind:open={confirmOpen}
			title="Rename the package?"
			description="You could call it something sensible. Nobody would remember it."
		>
			<p class="text-fg-muted">
				Fourteen people have asked so far. The answer has not changed, but the button works.
			</p>

			{#snippet footer()}
				<Button variant="ghost" onclick={() => (confirmOpen = false)}>Keep the name</Button>
				<Button
					variant="danger"
					onclick={() => {
						confirmOpen = false;
						toast('Nice try', { description: 'The name stays.' });
					}}
				>
					Rename anyway
				</Button>
			{/snippet}
		</Modal>

		<Modal bind:open={formOpen} title="New collection" size="sm">
			<div class="space-y-4">
				<Field label="Name" required>
					{#snippet children({ id, ...rest })}
						<Input {id} {...rest} placeholder="Reading list (not that kind)" />
					{/snippet}
				</Field>
				<Field label="Visible to">
					{#snippet children({ id, ...rest })}
						<Select {id} {...rest} options={visibility} placeholder="Pick one" />
					{/snippet}
				</Field>
			</div>

			{#snippet footer()}
				<Button variant="ghost" onclick={() => (formOpen = false)}>Cancel</Button>
				<Button
					onclick={() => {
						formOpen = false;
						toast.success('Collection created');
					}}
				>
					Create
				</Button>
			{/snippet}
		</Modal>
	</Demo>

	<Demo title="Drawer">
		<Button variant="outline" size="sm" onclick={() => openDrawer('right')}>Right</Button>
		<Button variant="outline" size="sm" onclick={() => openDrawer('left')}>Left</Button>
		<Button variant="outline" size="sm" onclick={() => openDrawer('top')}>Top</Button>
		<Button variant="outline" size="sm" onclick={() => openDrawer('bottom')}>Bottom</Button>

		<Drawer bind:open={drawerOpen} side={drawerSide} title="Filters">
			<div class="space-y-3">
				<Checkbox checked>In stock</Checkbox>
				<Checkbox>On sale</Checkbox>
				<Checkbox>Free shipping</Checkbox>
				<Checkbox>New this week</Checkbox>
				<Checkbox>Extra long</Checkbox>
			</div>

			{#snippet footer()}
				<Button variant="ghost" onclick={() => (drawerOpen = false)}>Reset</Button>
				<Button onclick={() => (drawerOpen = false)}>Apply</Button>
			{/snippet}
		</Drawer>
	</Demo>

	<Demo title="Dropdown menu" description="Arrow keys move between items, Escape closes.">
		<DropdownMenu>
			{#snippet trigger(attrs)}
				<Button variant="outline" {...attrs}>Options</Button>
			{/snippet}

			<MenuLabel>Document</MenuLabel>
			<MenuItem icon={pencil} hint="E" onselect={() => toast('Editing')}>Edit</MenuItem>
			<MenuItem hint="D" onselect={() => toast('Duplicated')}>Duplicate</MenuItem>
			<MenuItem href="#overlays">Open in new tab</MenuItem>
			<MenuSeparator />
			<MenuItem variant="danger" onselect={() => toast.error('Deleted')}>Delete</MenuItem>
		</DropdownMenu>
	</Demo>

	<Demo
		title="CommandPalette"
		description="Fuzzy search over a list of commands. The shortcut works anywhere on this page."
	>
		<Button variant="outline" onclick={() => (paletteOpen = true)}>
			Search commands
			<Kbd>{shortcut}</Kbd>
		</Button>

		<CommandPalette bind:open={paletteOpen} {commands} />
	</Demo>

	<Demo title="Popover" description="A positioned panel. Put whatever you want in it.">
		<Popover>
			{#snippet trigger(attrs)}
				<Button variant="outline" {...attrs}>Share</Button>
			{/snippet}

			{#snippet children({ close })}
				<div class="w-64 space-y-3">
					<p class="text-sm font-medium text-fg">Invite someone</p>
					<p class="text-xs text-fg-muted">It is more fun with more people.</p>
					<Field label="Email">
						{#snippet children({ id, ...rest })}
							<Input {id} {...rest} size="sm" placeholder="name@example.com" />
						{/snippet}
					</Field>
					<div class="flex justify-end gap-2">
						<Button size="sm" variant="ghost" onclick={close}>Cancel</Button>
						<Button
							size="sm"
							onclick={() => {
								close();
								toast.success('Invitation sent');
							}}
						>
							Send
						</Button>
					</div>
				</div>
			{/snippet}
		</Popover>
	</Demo>
</Section>
