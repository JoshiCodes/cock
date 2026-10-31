<script lang="ts" module>
	export interface Crumb {
		label: string;
		href?: string;
	}
</script>

<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		items: Crumb[];
		class?: string;
	}

	let { items, class: className }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class={cn('min-w-0', className)}>
	<ol class="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
		{#each items as item, index (item.label)}
			{@const last = index === items.length - 1}
			<li class="flex min-w-0 items-center gap-1.5">
				{#if last || !item.href}
					<span
						class={cn('truncate', last && 'font-medium text-fg')}
						aria-current={last ? 'page' : undefined}
					>
						{item.label}
					</span>
				{:else}
					<a href={item.href} class="truncate rounded transition-colors hover:text-fg">
						{item.label}
					</a>
				{/if}

				{#if !last}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
						class="size-3.5 shrink-0 text-fg-subtle"
					>
						<path
							d="m10 6 6 6-6 6"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
