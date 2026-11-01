<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { Button, ThemeToggle, cn } from '@joshicodes/cock';
	import ControlPanel from './ControlPanel.svelte';
	import Logo from './Logo.svelte';
	import { site } from './site.svelte.js';

	function isActive(href: string) {
		const section = href.split('/')[1];
		return page.url.pathname.split('/')[1] === section;
	}

	const links = [
		{ href: '/components', label: 'Components' },
		{ href: '/docs/getting-started', label: 'Docs' },
		{ href: '/themes', label: 'Themes' }
	];
</script>

<header class="sticky top-0 z-30 border-b border-border bg-bg">
	<div class="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 lg:px-8">
		<a href="/" aria-label="cock, home">
			<Logo wordmark />
		</a>

		<nav class="hidden items-center gap-6 text-sm sm:flex" aria-label="Main">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class={cn(
						'transition-colors',
						page.url.pathname === link.href ? 'font-medium text-fg' : 'text-fg-muted hover:text-fg'
					)}
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex-1"></div>

		<div class="flex items-center gap-2">
			<Button
				variant={site.customizing ? 'solid' : 'soft'}
				size="sm"
				aria-expanded={site.customizing}
				aria-controls="customize-panel"
				onclick={() => (site.customizing = !site.customizing)}
			>
				<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
					<path
						d="M4 7h10m4 0h2M4 17h4m4 0h8"
						stroke="currentColor"
						stroke-width="1.75"
						stroke-linecap="round"
					/>
					<circle cx="16" cy="7" r="2" stroke="currentColor" stroke-width="1.75" />
					<circle cx="10" cy="17" r="2" stroke="currentColor" stroke-width="1.75" />
				</svg>
				Customize
			</Button>

			<ThemeToggle class="size-8" />

			<a
				href="https://github.com/JoshiCodes/cock"
				aria-label="Source on GitHub"
				class="inline-flex size-8 items-center justify-center rounded-md border border-border bg-surface text-fg-muted shadow-xs transition-colors hover:bg-muted hover:text-fg"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
					<path
						d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
					/>
				</svg>
			</a>
		</div>
	</div>

	<!-- Under 640px the bar is full, so the links get a line of their own. -->
	<nav
		class="flex items-center gap-5 border-t border-border px-5 py-2.5 text-sm sm:hidden"
		aria-label="Main"
	>
		{#each links as link (link.href)}
			<a
				href={link.href}
				aria-current={isActive(link.href) ? 'page' : undefined}
				class={cn(
					'transition-colors',
					isActive(link.href) ? 'font-medium text-fg' : 'text-fg-muted'
				)}
			>
				{link.label}
			</a>
		{/each}
	</nav>

	{#if site.customizing}
		<div
			id="customize-panel"
			transition:slide={{ duration: 220 }}
			class="border-t border-border bg-surface"
		>
			<div class="mx-auto max-w-7xl px-5 py-7 lg:px-8">
				<ControlPanel />
			</div>
		</div>
	{/if}
</header>
