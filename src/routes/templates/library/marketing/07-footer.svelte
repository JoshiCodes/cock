<!-- A site footer with link columns, a short line about the company, the legal small print and a theme switch. -->
<script lang="ts" module>
	export const meta = {
		height: 380,
		options: [
			{ name: 'status', label: 'Status line', type: 'boolean', default: true },
			{ name: 'brand', label: 'Brand', type: 'text', default: 'fieldnote', placeholder: 'Brand' }
		]
	};
</script>

<script lang="ts">
	import { Link, StatusDot, ThemeToggle } from '@joshicodes/cock';

	let { status = true, brand = 'fieldnote' }: { status?: boolean; brand?: string } = $props();

	const columns = [
		{ title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
		{ title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
		{ title: 'Resources', links: ['Docs', 'Guides', 'API', 'Community'] }
	];
</script>

<div class="@container flex flex-col justify-end bg-bg">
	<footer class="border-t border-border px-6 pt-12 pb-8">
		<div class="mx-auto grid max-w-5xl gap-10 @3xl:grid-cols-[1.4fr_repeat(3,1fr)]">
			<div class="max-w-xs">
				<p class="flex items-center gap-2 font-semibold text-fg">
					<svg viewBox="0 0 20 20" class="size-5 text-accent" aria-hidden="true">
						<path d="M2 2h7v7H2zM11 11h7v7h-7z" fill="currentColor" />
						<path
							d="M11 2h7v7h-7zM2 11h7v7H2z"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						/>
					</svg>
					{brand}
				</p>
				<p class="mt-3 text-sm leading-relaxed text-fg-muted">
					Plans, reviews and the reasons behind them. Made by a small team in Hamburg.
				</p>
			</div>

			{#each columns as column (column.title)}
				<nav aria-label={column.title}>
					<h3 class="text-sm font-medium text-fg">{column.title}</h3>
					<ul class="mt-3 space-y-2 text-sm">
						{#each column.links as link (link)}
							<li><Link href="/" variant="muted" underline="hover">{link}</Link></li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div
			class="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-fg-subtle"
		>
			<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
				<span>© {new Date().getFullYear()} {brand}</span>
				<Link href="/" variant="muted" underline="hover">Terms</Link>
				<Link href="/" variant="muted" underline="hover">Privacy</Link>
				<Link href="/" variant="muted" underline="hover">Imprint</Link>
			</div>
			<div class="flex items-center gap-4">
				{#if status}
					<Link href="/" variant="muted" underline="hover" class="flex items-center gap-2">
						<StatusDot tone="success" size="sm" />
						All systems normal
					</Link>
				{/if}
				<ThemeToggle class="size-8" />
			</div>
		</div>
	</footer>
</div>
