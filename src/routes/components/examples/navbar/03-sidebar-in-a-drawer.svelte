<!-- On a phone the sidebar has no room of its own, so the same navbar moves into a Drawer. Picking a page closes it. -->
<script lang="ts">
	import { Avatar, Badge, Button, Drawer, Navbar, NavbarGroup, NavbarLink } from '@joshicodes/cock';

	let open = $state(false);
	let current = $state('#flock');

	function go(event: MouseEvent) {
		event.preventDefault();
		current = (event.currentTarget as HTMLAnchorElement).getAttribute('href') ?? '';
		open = false;
	}
</script>

<Button variant="outline" size="sm" onclick={() => (open = true)}>
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<path
			d="M4 7h16M4 12h16M4 17h16"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	</svg>
	Menu
</Button>

<Drawer bind:open side="left" title="Henhouse" size="w-full max-w-72">
	<!-- The drawer pads its body already; the negative margin lines the labels up with the title. -->
	<Navbar orientation="vertical" {current} label="Drawer" class="-mx-3 w-auto border-0 p-0">
		<NavbarGroup label="Workspace">
			<NavbarLink href="#inbox" onclick={go}>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<path d="M4 13h4l1.5 2.5h5L16 13h4M5.5 5h13L20 13v6H4v-6z" stroke-linejoin="round" />
					</svg>
				{/snippet}
				Inbox
				{#snippet trailing()}
					<Badge size="sm" variant="accent">4</Badge>
				{/snippet}
			</NavbarLink>
			<NavbarLink href="#flock" onclick={go}>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<circle cx="9" cy="8" r="3" />
						<path
							d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M16 5.5a3 3 0 0 1 0 5M18 14c1.4.7 2.3 2.4 2.5 5"
							stroke-linecap="round"
						/>
					</svg>
				{/snippet}
				Flock
			</NavbarLink>
			<NavbarLink href="#coops" onclick={go}>
				{#snippet icon()}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
						<path d="M4 11 12 5l8 6v8H4z M10 19v-5h4v5" stroke-linejoin="round" />
					</svg>
				{/snippet}
				Coops
			</NavbarLink>
		</NavbarGroup>

		<NavbarGroup label="Records">
			<NavbarLink href="#feed" onclick={go}>Feed</NavbarLink>
			<NavbarLink href="#ledger" onclick={go}>Egg ledger</NavbarLink>
		</NavbarGroup>

		{#snippet actions()}
			<div class="flex min-w-0 items-center gap-2.5 px-3">
				<Avatar name="Mabel Leghorn" size="sm" />
				<div class="min-w-0 text-sm">
					<p class="truncate font-medium text-fg">Mabel Leghorn</p>
					<p class="truncate text-xs text-fg-muted">Head of laying</p>
				</div>
			</div>
		{/snippet}
	</Navbar>
</Drawer>
