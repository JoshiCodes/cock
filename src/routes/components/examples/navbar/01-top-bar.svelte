<!-- In an app, current is page.url.pathname and the click handler goes. Narrow the window and the links fold away. -->
<script lang="ts">
	import { Button, Navbar, NavbarLink } from '@joshicodes/cock';

	let current = $state('#coops');

	function go(event: MouseEvent) {
		event.preventDefault();
		current = (event.currentTarget as HTMLAnchorElement).getAttribute('href') ?? '';
	}
</script>

<div class="w-full overflow-hidden rounded-lg border border-border">
	<Navbar {current} label="Example" class="border-b-0">
		{#snippet brand()}
			<span class="text-[0.9375rem] font-semibold tracking-tight text-fg">Henhouse</span>
		{/snippet}

		<NavbarLink href="#flock" onclick={go}>Flock</NavbarLink>
		<NavbarLink href="#coops" onclick={go}>Coops</NavbarLink>
		<NavbarLink href="#feed" onclick={go}>Feed</NavbarLink>
		<NavbarLink href="#ledger" onclick={go}>Egg ledger</NavbarLink>

		{#snippet actions()}
			<Button variant="ghost" size="sm">Sign in</Button>
			<Button size="sm">Start a flock</Button>
		{/snippet}
	</Navbar>
</div>
