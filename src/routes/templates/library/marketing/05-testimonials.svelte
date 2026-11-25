<!-- One quote large enough to read from across the room, and a running strip of shorter ones under it. -->
<script lang="ts" module>
	export const meta = {
		height: 620,
		thumbnail: { moving: false },
		options: [{ name: 'moving', label: 'Moving strip', type: 'boolean', default: true }]
	};
</script>

<script lang="ts">
	import { Avatar, Marquee, Rating } from '@joshicodes/cock';

	let { moving = true }: { moving?: boolean } = $props();

	const quotes = [
		{
			text: 'We moved forty people over in a week. Nobody asked for the old tool back.',
			name: 'Lena Hartmann',
			role: 'COO, Hartmann Studio'
		},
		{
			text: 'The history alone has settled three arguments this quarter.',
			name: 'Oskar Lindgren',
			role: 'Engineering lead, Fjord'
		},
		{
			text: 'Our clients finally read the plan before the call.',
			name: 'Chloé Martin',
			role: 'Founder, Atelier Nord'
		},
		{
			text: 'It is the first tool our designers and our lawyers both like.',
			name: 'Jonas Weber',
			role: 'Head of ops, Weber & Co'
		},
		{
			text: 'Search that finds the thing I half remember. Rare.',
			name: 'Hana Kobayashi',
			role: 'Researcher, Kobayashi Lab'
		}
	];
</script>

<section class="@container bg-bg py-16">
	<div class="mx-auto max-w-4xl px-6">
		<figure>
			<Rating value={5} readonly size="sm" label="Rated 5 out of 5" />
			<blockquote
				class="mt-5 text-3xl leading-snug font-medium tracking-tight text-balance text-fg @3xl:text-4xl"
			>
				“We stopped losing decisions in chat threads. Six months in, the plan and the reasons for it
				are still exactly where we left them.”
			</blockquote>
			<figcaption class="mt-8 flex items-center gap-3">
				<Avatar name="Priya Raman" size="md" />
				<span class="text-sm">
					<span class="block font-medium text-fg">Priya Raman</span>
					<span class="text-fg-muted">VP Product, Tidewater</span>
				</span>
			</figcaption>
		</figure>
	</div>

	{#snippet card(quote: (typeof quotes)[number])}
		<figure class="w-80 shrink-0 rounded-lg border border-border bg-surface p-5 whitespace-normal">
			<blockquote class="text-sm leading-relaxed text-fg">“{quote.text}”</blockquote>
			<figcaption class="mt-4 flex items-center gap-2.5 text-xs">
				<Avatar name={quote.name} size="xs" />
				<span>
					<span class="font-medium text-fg">{quote.name}</span>
					<span class="text-fg-muted"> · {quote.role}</span>
				</span>
			</figcaption>
		</figure>
	{/snippet}

	<div class="mt-14">
		{#if moving}
			<Marquee speed={40} fade pauseOnHover gap="1rem">
				{#each quotes as quote (quote.name)}
					{@render card(quote)}
				{/each}
			</Marquee>
		{:else}
			<div class="flex gap-4 overflow-x-auto px-6 pb-2">
				{#each quotes as quote (quote.name)}
					{@render card(quote)}
				{/each}
			</div>
		{/if}
	</div>
</section>
