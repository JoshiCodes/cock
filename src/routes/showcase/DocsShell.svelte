<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button, Drawer } from '@joshicodes/cock';
	import DocsNav from './DocsNav.svelte';

	let { children }: { children: Snippet } = $props();

	let menuOpen = $state(false);
</script>

<div class="mx-auto flex w-full max-w-7xl gap-10 px-5 lg:px-8">
	<!-- The full index is always there on a wide screen, and a tap away on a phone. -->
	<aside class="hidden w-56 shrink-0 py-12 lg:block">
		<div class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
			<DocsNav />
		</div>
	</aside>

	<div class="min-w-0 flex-1 pb-20">
		<div
			class="sticky top-16 z-20 -mx-5 border-b border-border bg-bg/90 px-5 py-2 backdrop-blur lg:hidden"
		>
			<Button variant="ghost" size="sm" onclick={() => (menuOpen = true)}>
				<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
					<path
						d="M4 7h16M4 12h16M4 17h10"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
					/>
				</svg>
				All components
			</Button>
		</div>

		{@render children()}
	</div>
</div>

<Drawer bind:open={menuOpen} side="left" title="Documentation">
	<DocsNav onnavigate={() => (menuOpen = false)} />
</Drawer>
