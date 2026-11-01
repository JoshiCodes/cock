<script lang="ts">
	import '@fontsource-variable/hanken-grotesk';
	import './layout.css';
	import { Toaster } from '@joshicodes/cock';
	import SiteHeader from './showcase/SiteHeader.svelte';

	const { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<!-- The docs sidebar is a long list to tab through before the page itself. -->
	<a
		href="#content"
		class="sr-only rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
	>
		Skip to content
	</a>

	<SiteHeader />

	<main id="content" class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-border">
		<div
			class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-fg-subtle lg:px-8"
		>
			<p>cock. Yes, it stands for core component kit. We checked twice.</p>
			<p class="hidden md:block">No roosters were harmed. Several egos were.</p>
			<div class="flex items-center gap-5">
				<a href="/llms.txt" class="transition-colors hover:text-fg">llms.txt</a>
				<a href="https://github.com/JoshiCodes/cock" class="transition-colors hover:text-fg">
					Source on GitHub
				</a>
			</div>
		</div>
	</footer>
</div>

<Toaster position="bottom-right" />
