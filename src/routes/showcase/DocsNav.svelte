<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '@joshicodes/cock';
	import { grouped } from '../components/catalog.js';

	let { onnavigate }: { onnavigate?: () => void } = $props();

	const guides = [
		{ href: '/docs/getting-started', label: 'Getting started' },
		{ href: '/docs/theming', label: 'Theming' },
		{ href: '/docs/comparison', label: 'How it compares' },
		{ href: '/themes', label: 'Theme generator' }
	];

	let current = $derived(page.url.pathname);

	const link = 'block rounded-md py-1 pl-3 text-sm transition-colors';
	const active = 'bg-muted font-medium text-fg';
	const idle = 'text-fg-muted hover:bg-muted/60 hover:text-fg';
</script>

<nav class="space-y-7">
	<div class="space-y-1">
		<p class="mb-2 pl-3 text-xs font-medium tracking-wide text-fg-subtle uppercase">Guides</p>
		{#each guides as item (item.href)}
			<a
				href={item.href}
				onclick={onnavigate}
				aria-current={current === item.href ? 'page' : undefined}
				class={cn(link, current === item.href ? active : idle)}
			>
				{item.label}
			</a>
		{/each}
	</div>

	{#each grouped as group (group.category.id)}
		<div class="space-y-1">
			<p class="mb-2 pl-3 text-xs font-medium tracking-wide text-fg-subtle uppercase">
				{group.category.title}
			</p>
			{#each group.items as item (item.slug)}
				{@const href = `/components/${item.slug}`}
				<a
					{href}
					onclick={onnavigate}
					aria-current={current === href ? 'page' : undefined}
					class={cn(link, current === href ? active : idle)}
				>
					{item.name}
				</a>
			{/each}
		</div>
	{/each}
</nav>
