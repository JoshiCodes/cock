<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Input, cn } from '@joshicodes/cock';
	import { grouped } from '../components/catalog.js';

	let { onnavigate }: { onnavigate?: () => void } = $props();

	const guides = [
		{ href: '/docs/getting-started', label: 'Getting started' },
		{ href: '/docs/theming', label: 'Theming' },
		{ href: '/docs/utilities', label: 'Helpers and actions' },
		{ href: '/docs/types', label: 'Types' },
		{ href: '/docs/comparison', label: 'How it compares' },
		{ href: '/themes', label: 'Theme generator' }
	];

	let current = $derived(page.url.pathname);
	let query = $state('');

	/** Guides and components as one list of sections, narrowed by the search. */
	let sections = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		const all = [
			{ id: 'guides', title: 'Guides', items: guides },
			...grouped.map((group) => ({
				id: group.category.id,
				title: group.category.title,
				items: group.items.map((item) => ({ href: `/components/${item.slug}`, label: item.name }))
			}))
		];
		if (!needle) return all;
		return all
			.map((section) => ({
				...section,
				items: section.items.filter((item) => item.label.toLowerCase().includes(needle))
			}))
			.filter((section) => section.items.length);
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const first = sections[0]?.items[0];
			if (!first) return;
			event.preventDefault();
			query = '';
			onnavigate?.();
			goto(first.href);
		} else if (event.key === 'Escape' && query) {
			event.stopPropagation();
			query = '';
		}
	}

	const link = 'block rounded-md py-1 pl-3 text-sm transition-colors';
	const active = 'bg-muted font-medium text-fg';
	const idle = 'text-fg-muted hover:bg-muted/60 hover:text-fg';
</script>

<nav class="space-y-7" aria-label="Documentation">
	<Input
		bind:value={query}
		{onkeydown}
		type="search"
		size="sm"
		placeholder="Find a component"
		aria-label="Find a component"
	/>

	{#each sections as section (section.id)}
		<div class="space-y-1">
			<p class="mb-2 pl-3 text-xs font-medium tracking-wide text-fg-subtle uppercase">
				{section.title}
			</p>
			{#each section.items as item (item.href)}
				<a
					href={item.href}
					onclick={() => {
						query = '';
						onnavigate?.();
					}}
					aria-current={current === item.href ? 'page' : undefined}
					class={cn(link, current === item.href ? active : idle)}
				>
					{item.label}
				</a>
			{/each}
		</div>
	{:else}
		<p class="pl-3 text-sm text-fg-muted">Nothing by that name. Yet.</p>
	{/each}
</nav>
