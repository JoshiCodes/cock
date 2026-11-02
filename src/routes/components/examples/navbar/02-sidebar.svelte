<!-- Groups give the sidebar its headings. The collapsible one remembers its state through bind:open. -->
<script lang="ts">
	import { Avatar, Badge, Navbar, NavbarGroup, NavbarLink } from '@joshicodes/cock';

	let current = $state('#inbox');
	let archiveOpen = $state(false);

	function go(event: MouseEvent) {
		event.preventDefault();
		current = (event.currentTarget as HTMLAnchorElement).getAttribute('href') ?? '';
	}
</script>

<div class="h-[26rem] overflow-hidden rounded-lg border border-border">
	<Navbar orientation="vertical" {current} label="Example sidebar" class="border-r-0">
		{#snippet brand()}
			<span class="text-[0.9375rem] font-semibold tracking-tight text-fg">Henhouse</span>
		{/snippet}

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

		<NavbarGroup label="Archive" collapsible bind:open={archiveOpen}>
			<NavbarLink href="#archive-2025" onclick={go}>2025</NavbarLink>
			<NavbarLink href="#archive-2024" onclick={go}>2024</NavbarLink>
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
</div>
