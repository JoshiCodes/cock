<script lang="ts">
	import '@fontsource-variable/hanken-grotesk';
	import './layout.css';
	import { Toaster } from '@joshicodes/cock';
	import SiteHeader from './showcase/SiteHeader.svelte';

	const { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<SiteHeader />

	<div class="flex-1">
		{@render children()}
	</div>

	<footer class="border-t border-border">
		<div
			class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-fg-subtle lg:px-8"
		>
			<p>cock. Yes, it stands for core component kit. We checked twice.</p>
			<p class="hidden md:block">No roosters were harmed. Several egos were.</p>
			<a href="https://github.com/JoshiCodes/cock" class="transition-colors hover:text-fg">
				Source on GitHub
			</a>
		</div>
	</footer>
</div>

<Toaster position="bottom-right" />
